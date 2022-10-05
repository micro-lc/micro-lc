import { css, html, LitElement } from 'lit'
import { property, state } from 'lit/decorators.js'
import type { ChangeEvent } from 'react'

interface LoadableElement extends HTMLElement {
  _loading: boolean
}

function handleSlotChange(this: LoadableElement, event: ChangeEvent<HTMLSlotElement>): void {
  event.target.assignedElements().forEach((element) => {
    if (element instanceof HTMLElement) {
      element.style.display = 'none'
      element.onload = () => {
        this._loading = false
        element.style.display = ''
      }
    }
  })
}

export class MlcLoadingAnimation extends LitElement implements LoadableElement {
  static styles = css`
    .loadingAnimation_svg_container {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      width: 100%;
      height: 100%;
    }

    #hexagon_left {
      animation: hexagon_left_animation 2200ms linear infinite normal forwards;
      fill: var(--microlc-ui-components-loading-inactive-color);
    }

    @keyframes hexagon_left_animation {
      0% {
        transform: translate(44px, 150px);
        fill: var(--microlc-ui-components-loading-active-color);
      }

      10%,
      15% {
        transform: translate(44px, 210px);
        fill: var(--microlc-ui-components-loading-active-color);
      }

      25%,
      30% {
        transform: translate(150px, 210px);
        fill: var(--microlc-ui-components-loading-active-color);
      }

      40%,
      45% {
        transform: translate(150px, 150px);
        fill: var(--microlc-ui-components-loading-inactive-color);
      }

      55%,
      60% {
        transform: translate(150px, 210px);
        fill: var(--microlc-ui-components-loading-active-color);
      }

      70%,
      75% {
        transform: translate(256px, 210px);
        fill: var(--microlc-ui-components-loading-active-color);
      }

      85%,
      100% {
        transform: translate(256px, 150px);
        fill: var(--microlc-ui-components-loading-inactive-color);
      }
    }

    #hexagon_center {
      animation: hexagon_center_animation 2200ms linear infinite normal forwards;
      fill: var(--microlc-ui-components-loading-inactive-color);
    }

    @keyframes hexagon_center_animation {
      0% {
        transform: translate(150px, 150px);
        fill: var(--microlc-ui-components-loading-active-color);
      }

      10%,
      15% {
        transform: translate(150px, 90px);
        fill: var(--microlc-ui-components-loading-active-color);
      }

      25%,
      30% {
        transform: translate(44px, 90px);
        fill: var(--microlc-ui-components-loading-active-color);
      }

      40%,
      100% {
        transform: translate(44px, 150px);
        fill: var(--microlc-ui-components-loading-inactive-color);
      }
    }

    #hexagon_right {
      animation: hexagon_right_animation 2200ms linear infinite normal forwards;
      fill: var(--microlc-ui-components-loading-inactive-color);
    }

    @keyframes hexagon_right_animation {
      0%,
      45% {
        transform: translate(256px, 150px);
        fill: var(--microlc-ui-components-loading-inactive-color);
      }

      55%,
      60% {
        transform: translate(256px, 90px);
        fill: var(--microlc-ui-components-loading-active-color);
      }

      70%,
      75% {
        transform: translate(150px, 90px);
        fill: var(--microlc-ui-components-loading-active-color);
      }

      85%,
      100% {
        transform: translate(150px, 150px);
        fill: var(--microlc-ui-components-loading-inactive-color);
      }
    }
  `

  @state() _loading = true

  protected _handleSlotChanges = handleSlotChange.bind(this)

  @property({ attribute: 'primary-color', reflect: true })
  set primaryColor(color: unknown) {
    typeof color === 'string' && (this.style.fill = color)
  }
  get primaryColor(): string {
    return this.style.fill
  }

  protected render(): unknown {
    return html`
      <div style=${this._loading ? '' : 'display: none'} class='loadingAnimation_svg_container'>
        <svg
          height="300"
          id="hexagon_container"
          shape-rendering="geometricPrecision"
          text-rendering="geometricPrecision"
          viewBox="0 0 300 300"
          width="300"
        >
          <g id="hexagon_left" transform="translate(44,150)">
            <path
              clipRule="evenodd"
              d="M139.541000,0.496202C140.686000,-0.165401,142.098000,-0.165401,143.244000,0.496202L183.338000,23.644300C184.484000,24.306000,185.190000,25.528600,185.190000,26.851900L185.190000,73.148100C185.190000,74.471400,184.484000,75.694000,183.338000,76.355600L143.244000,99.503800C142.098000,100.165000,140.686000,100.165000,139.541000,99.503800L99.446800,76.355600C98.300900,75.694000,97.594900,74.471400,97.594900,73.148100L97.594900,26.851900C97.594900,25.528600,98.300900,24.306000,99.446800,23.644300L139.541000,0.496202ZM105.002000,28.990200L105.002000,71.009800L141.392000,92.019600L177.782000,71.009800L177.782000,28.990200L141.392000,7.980370L105.002000,28.990200Z"
              id="ep3zs54gtu13"
              stroke="none"
              stroke-width="1"
              transform="translate(-141,-50)"
            />
          </g>
          <g id="hexagon_center" transform="translate(150,150)">
            <path
              clipRule="evenodd"
              d="M236.946000,0.496202C238.092000,-0.165401,239.503000,-0.165401,240.649000,0.496202L280.743000,23.644300C281.889000,24.306000,282.595000,25.528600,282.595000,26.851900L282.595000,73.148100C282.595000,74.471400,281.889000,75.694000,280.743000,76.355600L240.649000,99.503800C239.503000,100.165000,238.092000,100.165000,236.946000,99.503800L196.852000,76.355600C195.706000,75.694000,195,74.471400,195,73.148100L195,26.851900C195,25.528600,195.706000,24.306000,196.852000,23.644300L236.946000,0.496202ZM202.407000,28.990200L202.407000,71.009800L238.797000,92.019600L275.188000,71.009800L275.188000,28.990200L238.797000,7.980370L202.407000,28.990200Z"
              id="ep3zs54gtu14"
              stroke="none"
              stroke-width="1"
              transform="translate(-239,-50)"
            />
          </g>
          <g id="hexagon_right" transform="translate(256,150)">
            <path
              clipRule="evenodd"
              d="M41.945600,0.496202C43.091600,-0.165401,44.503400,-0.165401,45.649300,0.496202L85.743100,23.644300C86.889000,24.306000,87.594900,25.528600,87.594900,26.851900L87.594900,73.148100C87.594900,74.471400,86.889000,75.694000,85.743100,76.355600L45.649300,99.503800C44.503400,100.165000,43.091600,100.165000,41.945600,99.503800L1.851850,76.355600C0.705922,75.694000,0,74.471400,0,73.148100L0,26.851900C0,25.528600,0.705922,24.306000,1.851850,23.644300L41.945600,0.496202ZM7.407410,28.990200L7.407410,71.009800L43.797500,92.019600L80.187500,71.009800L80.187500,28.990200L43.797500,7.980370L7.407410,28.990200Z"
              id="ep3zs54gtu12"
              stroke="none"
              stroke-width="1"
              transform="translate(-44,-50)"
            />
          </g>
        </svg>
      </div>
      <slot @slotchange=${this._handleSlotChanges}></slot>
    `
  }
}
