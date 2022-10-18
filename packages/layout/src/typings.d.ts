declare module '*.less'
declare module '*.less?inline'

declare module 'monaco-editor/esm/vs/editor/editor.worker.js?worker' {
  export default class EditorWorker extends Worker {
    constructor()
  }
}
declare module 'monaco-editor/esm/vs/language/json/json.worker.js?worker' {
  export default class JsonWorker extends Worker {
    constructor()
  }
}

declare module '*.css'
