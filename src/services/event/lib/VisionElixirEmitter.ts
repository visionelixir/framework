import { EventEmitter } from 'events'
import { Emitter, Event, EventListener } from '../types'

export class VisionElixirEmitter implements Emitter {
  protected emitter: EventEmitter

  constructor() {
    this.emitter = new EventEmitter()
  }

  public on(event: string, callback: EventListener): VisionElixirEmitter {
    this.emitter.addListener(event, callback)

    return this
  }

  public off(event: string, callback: EventListener): VisionElixirEmitter {
    this.emitter.removeListener(event, callback)

    return this
  }

  public getListeners(event: string): EventListener[] {
    return this.emitter.listeners(event) as EventListener[]
  }

  public emit(eventName: string, eventInstance: Event): VisionElixirEmitter {
    this.emitter.emit(eventName, eventInstance)

    return this
  }

  public getNames(): Array<string | symbol> {
    return this.emitter.eventNames()
  }

  public clear(eventName: string): VisionElixirEmitter {
    this.emitter.removeAllListeners(eventName)

    return this
  }

  public clearAll(): VisionElixirEmitter {
    this.emitter.removeAllListeners()

    return this
  }

  public once(event: string, callback: EventListener): VisionElixirEmitter {
    this.emitter.once(event, callback)
    return this
  }

  public removeListener(
    event: string,
    callback: EventListener,
  ): VisionElixirEmitter {
    this.emitter.removeListener(event, callback)
    return this
  }
}
