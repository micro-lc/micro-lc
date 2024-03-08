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
export type { Config as MicrolcConfig } from '@micro-lc/interfaces/v2'
export type { CompleteConfig as MicrolcDefaultConfig } from './config.js'
export { defaultConfig } from './config.js'
export * from './web-component/index.js'
export * from './dom-manipulation/index.js'
