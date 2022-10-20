---
title: Composer API
sidebar_label: Composer API
sidebar_position: 30
---

> Descrivere composer API

```typescript
import type { Content } from '@micro-lc/interfaces/v2'
import { createComposerContext, premount } from '@micro-lc/composer'

const content: Content = {
  attributes: { id: 'inner-div' },
  content: [
    'Hello',
    {
      attributes: { id: 'paragraph' },
      booleanAttributes: 'hidden',
      properties: { today: 'date' },
      tag: 'p',
    },
  ],
  tag: 'div',
}

class MyAwesomeWebComponent extends HTMLElement {
  connectedCallback () {
    const appender = createComposerContext(
      content,
      { extraProperties: ['today'], context: { date: new Date() } }
    )

    appender(this)
  }
}

customElements.define('my-awesome-web-component', MyAwesomeWebComponent)
```

```html
<my-awesome-web-component>
  <div id="inner-div">
    Hello
    <p hidden id="paragraph"></p>
  </div>
</my-awesome-web-component>

<script>
  const paragraph = document.getElementById('paragraph')
  
  console.log(paragraph.today)
  // Output: ....
</script>
```

> premount risolve la configurazione

> createComposerContext prende la config e torna una funzione che si può utilizzare per appendere
> 
