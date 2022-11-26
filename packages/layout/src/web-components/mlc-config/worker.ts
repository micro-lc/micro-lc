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
// This must be excluded in storybook 👇

(function injectMonacoEnvironment() {
  const workers: Record<'default' | 'json' | 'yaml', () => Promise<Worker>> = {
    default: () => import('monaco-editor/esm/vs/editor/editor.worker?worker&inline').then(({ default: Worker }) => new Worker()),
    json: () => import('monaco-editor/esm/vs/language/json/json.worker?worker&inline').then(({ default: Worker }) => new Worker()),
    yaml: () => import('monaco-yaml/yaml.worker?worker&inline').then(({ default: Worker }) => new Worker()),
  }

  window.MonacoEnvironment = {
    async getWorker(_, label) {
      if (label === 'json' || label === 'yaml') {
        return workers[label]()
      }

      return workers.default()
    },
  }
}())

// end 👆
