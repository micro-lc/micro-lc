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
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
if (!('randomUUID' in window.crypto)) {
// https://stackoverflow.com/a/2117523/2800218
// LICENSE: https://creativecommons.org/licenses/by-sa/4.0/legalcode
  window.crypto.randomUUID = function randomUUID() {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
    return (
      // eslint-disable-next-line @typescript-eslint/restrict-plus-operands
      [1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g,
      // eslint-disable-next-line no-mixed-operators
      (ch) => (ch ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> ch / 4).toString(16)
    )
  }
}
