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
/** Prefix to apply to the generated set of variables. If more thant one is specified, a set for each prefix will be generated. */
export type VarsPrefix = string | string[]

/** Color definition. It can be a Hex, 8-digit Hex, RGB, RGBA HSL, HSLA, HSV, HSVA, CSS color name string */
export type Color = string
