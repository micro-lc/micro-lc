import type { CSSConfig } from '@micro-lc/orchestrator'
import { expect, fixture, html } from '@open-wc/testing'
import { createSandbox } from 'sinon'

import type { MlcAntdThemeManager } from '../../src'

import '../../src/web-components/mlc-antd-theme-manager'

describe('mlc-antd-theme-manager', () => {
  it('should send configuration to micro-lc API with default values', async () => {
    const sandbox = createSandbox()

    const setStyleStub = sandbox.stub()

    const microlcApi: Partial<MlcAntdThemeManager['microlcApi']> = {
      getExtensions: () => ({ css: { setStyle: setStyleStub } }),
    }

    await fixture(html`<mlc-antd-theme-manager .microlcApi=${microlcApi}></mlc-antd-theme-manager>`)

    const expectedVars = {
      '--micro-lc-error-color': 'rgb(255, 77, 79)',
      '--micro-lc-error-color-active': '#d9363e',
      '--micro-lc-error-color-deprecated-bg': '#fff2f0',
      '--micro-lc-error-color-deprecated-border': '#ffccc7',
      '--micro-lc-error-color-disabled': '#fff1f0',
      '--micro-lc-error-color-hover': '#ff7875',
      '--micro-lc-error-color-outline': 'rgba(255, 77, 79, 0.2)',
      '--micro-lc-font-family': "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue',  Arial, 'Noto Sans', sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji'",
      '--micro-lc-info-color': 'rgb(24, 144, 255)',
      '--micro-lc-info-color-active': '#096dd9',
      '--micro-lc-info-color-deprecated-bg': '#e6f7ff',
      '--micro-lc-info-color-deprecated-border': '#91d5ff',
      '--micro-lc-info-color-disabled': '#bae7ff',
      '--micro-lc-info-color-hover': '#40a9ff',
      '--micro-lc-info-color-outline': 'rgba(24, 144, 255, 0.2)',
      '--micro-lc-primary-1': '#e6f7ff',
      '--micro-lc-primary-10': '#002766',
      '--micro-lc-primary-2': '#bae7ff',
      '--micro-lc-primary-3': '#91d5ff',
      '--micro-lc-primary-4': '#69c0ff',
      '--micro-lc-primary-5': '#40a9ff',
      '--micro-lc-primary-6': '#1890ff',
      '--micro-lc-primary-7': '#096dd9',
      '--micro-lc-primary-8': '#0050b3',
      '--micro-lc-primary-9': '#003a8c',
      '--micro-lc-primary-color': 'rgb(24, 144, 255)',
      '--micro-lc-primary-color-active': '#096dd9',
      '--micro-lc-primary-color-active-deprecated-d-02': 'rgb(220, 244, 255)',
      '--micro-lc-primary-color-active-deprecated-f-30': 'rgba(230, 247, 255, 0.3)',
      '--micro-lc-primary-color-deprecated-bg': '#e6f7ff',
      '--micro-lc-primary-color-deprecated-border': '#91d5ff',
      '--micro-lc-primary-color-deprecated-f-12': 'rgba(24, 144, 255, 0.12)',
      '--micro-lc-primary-color-deprecated-l-20': 'rgb(126, 193, 255)',
      '--micro-lc-primary-color-deprecated-l-35': 'rgb(202, 230, 255)',
      '--micro-lc-primary-color-deprecated-t-20': 'rgb(70, 166, 255)',
      '--micro-lc-primary-color-deprecated-t-50': 'rgb(140, 200, 255)',
      '--micro-lc-primary-color-disabled': '#bae7ff',
      '--micro-lc-primary-color-hover': '#40a9ff',
      '--micro-lc-primary-color-outline': 'rgba(24, 144, 255, 0.2)',
      '--micro-lc-success-color': 'rgb(82, 196, 26)',
      '--micro-lc-success-color-active': '#389e0d',
      '--micro-lc-success-color-deprecated-bg': '#f6ffed',
      '--micro-lc-success-color-deprecated-border': '#b7eb8f',
      '--micro-lc-success-color-disabled': '#d9f7be',
      '--micro-lc-success-color-hover': '#73d13d',
      '--micro-lc-success-color-outline': 'rgba(82, 196, 26, 0.2)',
      '--micro-lc-warning-color': 'rgb(250, 173, 20)',
      '--micro-lc-warning-color-active': '#d48806',
      '--micro-lc-warning-color-deprecated-bg': '#fffbe6',
      '--micro-lc-warning-color-deprecated-border': '#ffe58f',
      '--micro-lc-warning-color-disabled': '#fff1b8',
      '--micro-lc-warning-color-hover': '#ffc53d',
      '--micro-lc-warning-color-outline': 'rgba(250, 173, 20, 0.2)',
    }

    expect(setStyleStub).to.be.calledOnce

    const [receivedArgs] = setStyleStub.args
    expect(receivedArgs).to.deep.equal([{ global: expectedVars, nodes: {} }])

    sandbox.restore()
  })

  it('should send configuration to micro-lc API with values and multiple prefixes', async () => {
    const sandbox = createSandbox()

    const setStyleStub = sandbox.stub()

    const microlcApi: Partial<MlcAntdThemeManager['microlcApi']> = {
      getExtensions: () => ({ css: { setStyle: setStyleStub } }),
    }

    await fixture(html`
      <mlc-antd-theme-manager
        .microlcApi=${microlcApi}
        .varsPrefix=${['prefix-1', 'prefix-2']}
        .primaryColor=${'#25B864'}
        .infoColor=${'#884DFF'}
        .successColor=${'#4DD9FF'}
        .processingColor=${'#FF4DC8'}
        .errorColor=${'#FCFF4D'}
        .warningColor=${'#FFB74D'}
        .fontFamily=${'font-family'}
      ></mlc-antd-theme-manager>
    `)

    const expectedVars = {
      '--prefix-1-error-color': 'rgb(252, 255, 77)',
      '--prefix-1-error-color-active': '#d1d936',
      '--prefix-1-error-color-deprecated-bg': '#fffdf0',
      '--prefix-1-error-color-deprecated-border': '#fffac7',
      '--prefix-1-error-color-disabled': '#fffdf0',
      '--prefix-1-error-color-hover': '#fffd75',
      '--prefix-1-error-color-outline': 'rgba(252, 255, 77, 0.2)',
      '--prefix-1-font-family': 'font-family',
      '--prefix-1-info-color': 'rgb(136, 77, 255)',
      '--prefix-1-info-color-active': '#6736d9',
      '--prefix-1-info-color-deprecated-bg': '#f7f0ff',
      '--prefix-1-info-color-deprecated-border': '#dfc7ff',
      '--prefix-1-info-color-disabled': '#f7f0ff',
      '--prefix-1-info-color-hover': '#a875ff',
      '--prefix-1-info-color-outline': 'rgba(136, 77, 255, 0.2)',
      '--prefix-1-primary-1': '#e9f7ec',
      '--prefix-1-primary-10': '#011f12',
      '--prefix-1-primary-2': '#c5ebd0',
      '--prefix-1-primary-3': '#97deaf',
      '--prefix-1-primary-4': '#6dd192',
      '--prefix-1-primary-5': '#47c479',
      '--prefix-1-primary-6': '#25b864',
      '--prefix-1-primary-7': '#16914f',
      '--prefix-1-primary-8': '#0b6b3b',
      '--prefix-1-primary-9': '#034526',
      '--prefix-1-primary-color': 'rgb(37, 184, 100)',
      '--prefix-1-primary-color-active': '#16914f',
      '--prefix-1-primary-color-active-deprecated-d-02': 'rgb(225, 244, 230)',
      '--prefix-1-primary-color-active-deprecated-f-30': 'rgba(233, 247, 236, 0.3)',
      '--prefix-1-primary-color-deprecated-bg': '#e9f7ec',
      '--prefix-1-primary-color-deprecated-border': '#97deaf',
      '--prefix-1-primary-color-deprecated-f-12': 'rgba(37, 184, 100, 0.12)',
      '--prefix-1-primary-color-deprecated-l-20': 'rgb(99, 224, 153)',
      '--prefix-1-primary-color-deprecated-l-35': 'rgb(163, 236, 194)',
      '--prefix-1-primary-color-deprecated-t-20': 'rgb(81, 198, 131)',
      '--prefix-1-primary-color-deprecated-t-50': 'rgb(146, 220, 178)',
      '--prefix-1-primary-color-disabled': '#c5ebd0',
      '--prefix-1-primary-color-hover': '#47c479',
      '--prefix-1-primary-color-outline': 'rgba(37, 184, 100, 0.2)',
      '--prefix-1-success-color': 'rgb(77, 217, 255)',
      '--prefix-1-success-color-active': '#36b0d9',
      '--prefix-1-success-color-deprecated-bg': '#f0feff',
      '--prefix-1-success-color-deprecated-border': '#c7f8ff',
      '--prefix-1-success-color-disabled': '#f0feff',
      '--prefix-1-success-color-hover': '#75e6ff',
      '--prefix-1-success-color-outline': 'rgba(77, 217, 255, 0.2)',
      '--prefix-1-warning-color': 'rgb(255, 183, 77)',
      '--prefix-1-warning-color-active': '#d99236',
      '--prefix-1-warning-color-deprecated-bg': '#fffbf0',
      '--prefix-1-warning-color-deprecated-border': '#ffeec7',
      '--prefix-1-warning-color-disabled': '#fffbf0',
      '--prefix-1-warning-color-hover': '#ffcd75',
      '--prefix-1-warning-color-outline': 'rgba(255, 183, 77, 0.2)',
      '--prefix-2-error-color': 'rgb(252, 255, 77)',
      '--prefix-2-error-color-active': '#d1d936',
      '--prefix-2-error-color-deprecated-bg': '#fffdf0',
      '--prefix-2-error-color-deprecated-border': '#fffac7',
      '--prefix-2-error-color-disabled': '#fffdf0',
      '--prefix-2-error-color-hover': '#fffd75',
      '--prefix-2-error-color-outline': 'rgba(252, 255, 77, 0.2)',
      '--prefix-2-font-family': 'font-family',
      '--prefix-2-info-color': 'rgb(136, 77, 255)',
      '--prefix-2-info-color-active': '#6736d9',
      '--prefix-2-info-color-deprecated-bg': '#f7f0ff',
      '--prefix-2-info-color-deprecated-border': '#dfc7ff',
      '--prefix-2-info-color-disabled': '#f7f0ff',
      '--prefix-2-info-color-hover': '#a875ff',
      '--prefix-2-info-color-outline': 'rgba(136, 77, 255, 0.2)',
      '--prefix-2-primary-1': '#e9f7ec',
      '--prefix-2-primary-10': '#011f12',
      '--prefix-2-primary-2': '#c5ebd0',
      '--prefix-2-primary-3': '#97deaf',
      '--prefix-2-primary-4': '#6dd192',
      '--prefix-2-primary-5': '#47c479',
      '--prefix-2-primary-6': '#25b864',
      '--prefix-2-primary-7': '#16914f',
      '--prefix-2-primary-8': '#0b6b3b',
      '--prefix-2-primary-9': '#034526',
      '--prefix-2-primary-color': 'rgb(37, 184, 100)',
      '--prefix-2-primary-color-active': '#16914f',
      '--prefix-2-primary-color-active-deprecated-d-02': 'rgb(225, 244, 230)',
      '--prefix-2-primary-color-active-deprecated-f-30': 'rgba(233, 247, 236, 0.3)',
      '--prefix-2-primary-color-deprecated-bg': '#e9f7ec',
      '--prefix-2-primary-color-deprecated-border': '#97deaf',
      '--prefix-2-primary-color-deprecated-f-12': 'rgba(37, 184, 100, 0.12)',
      '--prefix-2-primary-color-deprecated-l-20': 'rgb(99, 224, 153)',
      '--prefix-2-primary-color-deprecated-l-35': 'rgb(163, 236, 194)',
      '--prefix-2-primary-color-deprecated-t-20': 'rgb(81, 198, 131)',
      '--prefix-2-primary-color-deprecated-t-50': 'rgb(146, 220, 178)',
      '--prefix-2-primary-color-disabled': '#c5ebd0',
      '--prefix-2-primary-color-hover': '#47c479',
      '--prefix-2-primary-color-outline': 'rgba(37, 184, 100, 0.2)',
      '--prefix-2-success-color': 'rgb(77, 217, 255)',
      '--prefix-2-success-color-active': '#36b0d9',
      '--prefix-2-success-color-deprecated-bg': '#f0feff',
      '--prefix-2-success-color-deprecated-border': '#c7f8ff',
      '--prefix-2-success-color-disabled': '#f0feff',
      '--prefix-2-success-color-hover': '#75e6ff',
      '--prefix-2-success-color-outline': 'rgba(77, 217, 255, 0.2)',
      '--prefix-2-warning-color': 'rgb(255, 183, 77)',
      '--prefix-2-warning-color-active': '#d99236',
      '--prefix-2-warning-color-deprecated-bg': '#fffbf0',
      '--prefix-2-warning-color-deprecated-border': '#ffeec7',
      '--prefix-2-warning-color-disabled': '#fffbf0',
      '--prefix-2-warning-color-hover': '#ffcd75',
      '--prefix-2-warning-color-outline': 'rgba(255, 183, 77, 0.2)',
    }

    expect(setStyleStub).to.be.calledOnce

    const [receivedArgs] = setStyleStub.args
    expect(receivedArgs).to.deep.equal([{ global: expectedVars, nodes: {} }])

    sandbox.restore()
  })

  it('should send configuration to micro-lc API with nodes', async () => {
    const sandbox = createSandbox()

    const setStyleStub = sandbox.stub<[CSSConfig], void>()

    const microlcApi: Partial<MlcAntdThemeManager['microlcApi']> = {
      getExtensions: () => ({ css: { setStyle: setStyleStub } }),
    }

    const nodes = { '.banana': { color: 'yellow' } }

    await fixture(html`
      <mlc-antd-theme-manager
        .microlcApi=${microlcApi}
        .nodes=${nodes}
      ></mlc-antd-theme-manager>
    `)

    expect(setStyleStub).to.be.calledOnce

    const [receivedArgs] = setStyleStub.args
    expect(receivedArgs).to.have.lengthOf(1)
    expect(receivedArgs[0].global).to.be.an('object')
    expect(receivedArgs[0].nodes).to.equal(nodes)

    sandbox.restore()
  })
})
