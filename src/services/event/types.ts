import { Container } from '../container/types'

export interface Emitter {
  on: (event: string, callback: EventListener) => Emitter
  off: (event: string, callback: EventListener) => Emitter
  getListeners: (event: string) => EventListener[]
  emit: (eventName: string, eventInstance: Event) => Emitter
  once: (event: string, callback: EventListener) => Emitter
  removeAllListeners: (event?: string | symbol) => Emitter
}

export interface Event {
  setName(name: string): Event
  setData<T>(data: T): Event
  getName(): string
  getData<T>(): T
}

export interface EventListener {
  (event: Event): void
}

export enum VisionElixirRequestEvents {
  INIT_SERVICE_SETUP_PRE = 'VE:Init:Service.Setup.Pre',
  INIT_SERVICE_SETUP_POST = 'VE:Init:Service.Setup.Post',
  RESPONSE_PRE = 'VE:Response:Pre',
  RESPONSE_POST = 'VE:Response:Post',
  RESPONSE_ERROR = 'VE:Response:Error',
  RESPONSE_DESTROY = 'VE:Response:Destroy',
  APP_DATA = 'VE:Data',
  INIT_VARS = 'VE:Init:Vars',
}

export enum VisionElixirJobEvents {
  JOB_PRE = 'VE:Job.Pre',
  JOB_POST = 'VE:Job.Post',
}

export enum VisionElixirApplicationEvents {
  INIT_MIDDLEWARE = 'VE:Init:Middleware',
}

declare module '../app/types' {
  interface Service {
    registerEvents?: (emitter?: Emitter, container?: Container) => void
    applicationRegisterEvents?: (
      emitter?: Emitter,
      container?: Container,
    ) => void
  }
}

export const SERVICE_EMITTER = 'emitter'
