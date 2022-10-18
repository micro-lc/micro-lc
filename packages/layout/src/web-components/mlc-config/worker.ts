import * as monaco from 'monaco-editor'
import EditorWorker from 'monaco-editor/esm/vs/editor/editor.worker.js?worker'
import JsonWorker from 'monaco-editor/esm/vs/language/json/json.worker.js?worker'

type IEditorAction = monaco.editor.IEditorAction
type IStandaloneCodeEditor = monaco.editor.IStandaloneCodeEditor

window.MonacoEnvironment = {
  getWorker(_, label) {
    if (label === 'json') {
      return new JsonWorker()
    }
    return new EditorWorker()
  },
}

export type { IStandaloneCodeEditor, IEditorAction }
export const { editor, KeyCode, KeyMod } = monaco
