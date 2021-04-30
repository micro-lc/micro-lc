/*
 * Copyright 2021 Mia srl
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import {FromSchema} from 'json-schema-to-ts'

export const logoSchema = {
  type: 'object',
  properties: {
    url_light_image: {
      type: 'string',
      description: 'Light logo image url',
    },
    url_dark_image: {
      type: 'string',
      description: 'Dark logo image url',
    },
    alt: {
      type: 'string',
      description: 'Logo alt',
    },
    navigation_url: {
      type: 'string',
      description: 'Link to the navigation page reached when the logo is clicked',
    },
  },
  required: ['url_light_image', 'alt'],
} as const

export type Logo = FromSchema<typeof logoSchema>
