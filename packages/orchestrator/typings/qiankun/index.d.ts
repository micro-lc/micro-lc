/**
 * SAFETY: this is inherited by `qiankun`
 */
/* eslint-disable @typescript-eslint/no-explicit-any */
declare type ActivityFn = (location: Location) => boolean
declare type Activity = ActivityFn | string | (ActivityFn | string)[]
declare type ObjectType = Record<string, any>
declare type Entry = string | {
    html?: string
    scripts?: string[]
    styles?: string[]
}
declare interface AppMetadata {
    entry: Entry
    name: string
}
declare type HTMLContentRender = (props: {
    appContent: string
    loading: boolean
}) => any
declare type LoadableApp<T extends ObjectType> = AppMetadata & {
    props?: T
} & ({
    render: HTMLContentRender
} | {
    container: string | HTMLElement
})
declare type RegistrableApp<T extends ObjectType> = LoadableApp<T> & {
    activeRule: Activity
    loader?: (loading: boolean) => void
}
declare interface AppInstance {
    name: string
    window: WindowProxy
}

interface Qiankun {
  getCurrentRunningApp(): AppInstance | null
  registerMicroApps<T extends ObjectType>(apps: RegistrableApp<T>[], lifeCycles?: FrameworkLifeCycles<T>): void
  setDefaultMountApp(defaultAppLink: string): void
  start(): void
}

declare module 'qiankun/dist/index.umd.min.js' {
  declare global {
    const qiankun: Qiankun | undefined
  }
}

declare module 'qiankun/dist/index.umd.js' {
  declare global {
    const qiankun: Qiankun | undefined
  }
}

