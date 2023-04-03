import _objectSpread from "@babel/runtime/helpers/esm/objectSpread2";
/**
 * @author Kuitos
 * @since 2020-10-13
 */
import { isBoundedFunction, nativeDocument, nativeGlobal } from '../../../utils';
import { getCurrentRunningApp } from '../../common';
import { calcAppCount, getAppWrapperHeadElement, isAllAppsUnmounted, isHijackingTag, patchHTMLDynamicAppendPrototypeFunctions, rebuildCSSRules, recordStyledComponentsCSSRules, styleElementTargetSymbol } from './common';
// Get native global window with a sandbox disgusted way, thus we could share it between qiankun instances🤪
Object.defineProperty(nativeGlobal, '__proxyAttachContainerConfigMap__', {
  enumerable: false,
  writable: true
});
var rawHeadAppendChild = HTMLHeadElement.prototype.appendChild;
// Share proxyAttachContainerConfigMap between multiple qiankun instance, thus they could access the same record
nativeGlobal.__proxyAttachContainerConfigMap__ = nativeGlobal.__proxyAttachContainerConfigMap__ || new WeakMap();
var proxyAttachContainerConfigMap = nativeGlobal.__proxyAttachContainerConfigMap__;
var elementAttachContainerConfigMap = new WeakMap();
var docCreatePatchedMap = new WeakMap();
var mutationObserverPatchedMap = new WeakMap();
var parentNodePatchedMap = new WeakMap();
function patchDocument(cfg) {
  var sandbox = cfg.sandbox,
    speedy = cfg.speedy;
  var attachElementToProxy = function attachElementToProxy(element, proxy) {
    var proxyContainerConfig = proxyAttachContainerConfigMap.get(proxy);
    if (proxyContainerConfig) {
      elementAttachContainerConfigMap.set(element, proxyContainerConfig);
    }
  };
  if (speedy) {
    var proxyDocument = new Proxy(document, {
      set: function set(target, p, value) {
        target[p] = value;
        return true;
      },
      get: function get(target, p, r) {
        if (p === 'createElement') {
          // Must store the original createElement function to avoid error in nested sandbox
          var targetCreateElement = target.createElement;
          return function createElement() {
            for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
              args[_key] = arguments[_key];
            }
            var element = targetCreateElement.call.apply(targetCreateElement, [target].concat(args));
            attachElementToProxy(element, sandbox.proxy);
            return element;
          };
        }
        var value = target[p];
        // must rebind the function to the target otherwise it will cause illegal invocation error
        if (typeof value === 'function' && !isBoundedFunction(value)) {
          return function (...args) {
            return Reflect.apply(value, target, args.map((arg) => arg === r ? target : arg));
          }
        }
        return value;
      }
    });
    sandbox.patchDocument(proxyDocument);
    // patch MutationObserver.prototype.observe to avoid type error
    // https://github.com/umijs/qiankun/issues/2406
    var nativeMutationObserverObserveFn = MutationObserver.prototype.observe;
    if (!mutationObserverPatchedMap.has(nativeMutationObserverObserveFn)) {
      var observe = function observe(target, options) {
        var realTarget = target instanceof Document ? nativeDocument : target;
        return nativeMutationObserverObserveFn.call(this, realTarget, options);
      };
      MutationObserver.prototype.observe = observe;
      mutationObserverPatchedMap.set(nativeMutationObserverObserveFn, observe);
    }
    // patch parentNode getter to avoid document === html.parentNode
    // https://github.com/umijs/qiankun/issues/2408#issuecomment-1446229105
    var parentNodeDescriptor = Object.getOwnPropertyDescriptor(Node.prototype, 'parentNode');
    if (parentNodeDescriptor && !parentNodePatchedMap.has(parentNodeDescriptor)) {
      var parentNodeGetter = parentNodeDescriptor.get,
        configurable = parentNodeDescriptor.configurable;
      if (parentNodeGetter && configurable) {
        var patchedParentNodeDescriptor = _objectSpread(_objectSpread({}, parentNodeDescriptor), {}, {
          get: function get() {
            var parentNode = parentNodeGetter.call(this);
            if (parentNode instanceof Document) {
              var _getCurrentRunningApp;
              var proxy = (_getCurrentRunningApp = getCurrentRunningApp()) === null || _getCurrentRunningApp === void 0 ? void 0 : _getCurrentRunningApp.window;
              if (proxy) {
                return proxy.document;
              }
            }
            return parentNode;
          }
        });
        Object.defineProperty(Node.prototype, 'parentNode', patchedParentNodeDescriptor);
        parentNodePatchedMap.set(parentNodeDescriptor, patchedParentNodeDescriptor);
      }
    }
    return function () {
      MutationObserver.prototype.observe = nativeMutationObserverObserveFn;
      mutationObserverPatchedMap.delete(nativeMutationObserverObserveFn);
      if (parentNodeDescriptor) {
        Object.defineProperty(Node.prototype, 'parentNode', parentNodeDescriptor);
        parentNodePatchedMap.delete(parentNodeDescriptor);
      }
    };
  }
  var docCreateElementFnBeforeOverwrite = docCreatePatchedMap.get(document.createElement);
  if (!docCreateElementFnBeforeOverwrite) {
    var rawDocumentCreateElement = document.createElement;
    Document.prototype.createElement = function createElement(tagName, options) {
      var element = rawDocumentCreateElement.call(this, tagName, options);
      if (isHijackingTag(tagName)) {
        var _ref = getCurrentRunningApp() || {},
          currentRunningSandboxProxy = _ref.window;
        if (currentRunningSandboxProxy) {
          attachElementToProxy(element, currentRunningSandboxProxy);
        }
      }
      return element;
    };
    // It means it have been overwritten while createElement is an own property of document
    if (document.hasOwnProperty('createElement')) {
      document.createElement = Document.prototype.createElement;
    }
    docCreatePatchedMap.set(Document.prototype.createElement, rawDocumentCreateElement);
  }
  return function unpatch() {
    if (docCreateElementFnBeforeOverwrite) {
      Document.prototype.createElement = docCreateElementFnBeforeOverwrite;
      document.createElement = docCreateElementFnBeforeOverwrite;
    }
  };
}
export function patchStrictSandbox(appName, appWrapperGetter, sandbox) {
  var mounting = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : true;
  var scopedCSS = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : false;
  var excludeAssetFilter = arguments.length > 5 ? arguments[5] : undefined;
  var speedySandbox = arguments.length > 6 && arguments[6] !== undefined ? arguments[6] : false;
  var proxy = sandbox.proxy;
  var containerConfig = proxyAttachContainerConfigMap.get(proxy);
  if (!containerConfig) {
    containerConfig = {
      appName: appName,
      proxy: proxy,
      appWrapperGetter: appWrapperGetter,
      dynamicStyleSheetElements: [],
      strictGlobal: true,
      speedySandbox: speedySandbox,
      excludeAssetFilter: excludeAssetFilter,
      scopedCSS: scopedCSS
    };
    proxyAttachContainerConfigMap.set(proxy, containerConfig);
  }
  // all dynamic style sheets are stored in proxy container
  var _containerConfig = containerConfig,
    dynamicStyleSheetElements = _containerConfig.dynamicStyleSheetElements;
  var unpatchDocument = patchDocument({
    sandbox: sandbox,
    speedy: speedySandbox
  });
  var unpatchDynamicAppendPrototypeFunctions = patchHTMLDynamicAppendPrototypeFunctions(function (element) {
    return elementAttachContainerConfigMap.has(element);
  }, function (element) {
    return elementAttachContainerConfigMap.get(element);
  });
  if (!mounting) calcAppCount(appName, 'increase', 'bootstrapping');
  if (mounting) calcAppCount(appName, 'increase', 'mounting');
  return function free() {
    if (!mounting) calcAppCount(appName, 'decrease', 'bootstrapping');
    if (mounting) calcAppCount(appName, 'decrease', 'mounting');
    // release the overwritten prototype after all the micro apps unmounted
    if (isAllAppsUnmounted()) {
      unpatchDynamicAppendPrototypeFunctions();
      unpatchDocument();
    }
    recordStyledComponentsCSSRules(dynamicStyleSheetElements);
    // As now the sub app content all wrapped with a special id container,
    // the dynamic style sheet would be removed automatically while unmoutting
    return function rebuild() {
      rebuildCSSRules(dynamicStyleSheetElements, function (stylesheetElement) {
        var appWrapper = appWrapperGetter();
        if (!appWrapper.contains(stylesheetElement)) {
          var mountDom = stylesheetElement[styleElementTargetSymbol] === 'head' ? getAppWrapperHeadElement(appWrapper) : appWrapper;
          rawHeadAppendChild.call(mountDom, stylesheetElement);
          return true;
        }
        return false;
      });
    };
  };
}