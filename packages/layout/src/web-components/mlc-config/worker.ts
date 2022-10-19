import * as monaco from 'monaco-editor'
import EditorWorker from 'monaco-editor/esm/vs/editor/editor.worker?worker&inline'
import JsonWorker from 'monaco-editor/esm/vs/language/json/json.worker?worker&inline'
import YamlWorker from 'monaco-yaml/yaml.worker?worker&inline'

type ITextModel = monaco.editor.ITextModel
type IEditorAction = monaco.editor.IEditorAction
type IStandaloneCodeEditor = monaco.editor.IStandaloneCodeEditor

window.MonacoEnvironment = {
  getWorker(_, label) {
    if (label === 'json') {
      return new JsonWorker()
    }
    if (label === 'yaml') {
      return new YamlWorker()
    }
    return new EditorWorker()
  },
}

export type { IStandaloneCodeEditor, IEditorAction, ITextModel }
export const { editor, KeyCode, KeyMod, Uri } = monaco
