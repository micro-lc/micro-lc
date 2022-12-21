declare module '*.less'
declare module '*.less?inline'
declare module '*.css?inline'

declare module '*.json?url' {
  const url: string
  export default url
}

declare module 'monaco-editor/esm/vs/editor/editor.worker?worker&inline' {
  export default class EditorWorker extends Worker {
    constructor()
  }
}
declare module 'monaco-editor/esm/vs/language/json/json.worker?worker&inline' {
  export default class JsonWorker extends Worker {
    constructor()
  }
}

declare module 'monaco-yaml/yaml.worker?worker&inline' {
  export default class YamlWorker extends Worker {
    constructor()
  }
}

declare module '*.css'
