import { Container } from '../container/types'

export interface Emitter {
  on: (event: string, callback: EventListener) => Emitter
  off: (event: string, callback: EventListener) => Emitter
  getListeners: (event: string) => EventListener[]
  emit: (eventName: string, eventInstance: Event) => Emitter
}

export interface Event {
  setName(name: string): Event
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  setData(data: any): Event
  getName(): string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  getData(): any
}

export interface EventListener {
  (event: Event): void
}

export enum VisionElixirLocalEvents {
  INIT_SERVICE_SETUP_PRE = 'VE:Init:Service.Setup.Pre',
  INIT_SERVICE_SETUP_POST = 'VE:Init:Service.Setup.Post',
  RESPONSE_PRE = 'VE:Response:Pre',
  RESPONSE_POST = 'VE:Response:Post',
  RESPONSE_ERROR = 'VE:Response:Error',
  APP_DATA = 'VE:Data',
  INIT_VARS = 'VE:Init:Vars',
}

export enum VisionElixirGlobalEvents {
  INIT_MIDDLEWARE = 'VE:Init:Middleware',
}

declare module '../app/types' {
  interface Service {
    registerEvents?: (emitter?: Emitter, container?: Container) => void
    globalRegisterEvents?: (emitter?: Emitter, container?: Container) => void
  }
}

export const SERVICE_EMITTER = 'emitter'
