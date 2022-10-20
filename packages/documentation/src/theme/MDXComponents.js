import { ExampleFrame } from '@site/src/components/ExampleFrame'
import { SourceTabs } from '@site/src/components/SourceTabs'
import { MicroLc } from '@site/src/components/MicroLc'
import { ConsoleErrorLine } from '@site/src/components/ConsoleErrorLine'
import MDXComponents from '@theme-original/MDXComponents'

export default {
  ...MDXComponents,
  'example-frame': ExampleFrame,
  'source-tabs': SourceTabs,
  'micro-lc': MicroLc,
  'console-error-line': ConsoleErrorLine
}
