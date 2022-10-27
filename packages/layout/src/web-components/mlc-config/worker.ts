/**
  Copyright 2022 Mia srl

  Licensed under the Apache License, Version 2.0 (the "License");
  you may not use this file except in compliance with the License.
  You may obtain a copy of the License at

      http://www.apache.org/licenses/LICENSE-2.0

  Unless required by applicable law or agreed to in writing, software
  distributed under the License is distributed on an "AS IS" BASIS,
  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  See the License for the specific language governing permissions and
  limitations under the License.
*/
import * as monaco from 'monaco-editor/esm/vs/editor/editor.api'
import EditorWorker from 'monaco-editor/esm/vs/editor/editor.worker?worker&inline'
import JsonWorker from 'monaco-editor/esm/vs/language/json/json.worker?worker&inline'
import YamlWorker from 'monaco-yaml/yaml.worker?worker&inline'

import './monaco-contrib'

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
export const { editor, languages, KeyCode, KeyMod, Uri } = monaco
export const schema = 'https://cdn.jsdelivr.net/npm/@micro-lc/interfaces@latest/schemas/v2/config.schema.json'
