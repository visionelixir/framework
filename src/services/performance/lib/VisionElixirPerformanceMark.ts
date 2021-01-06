import { performance } from 'perf_hooks'
import { PerformanceError } from '../errors/PerformanceError'
import { PerformanceMark } from '../types'

export class VisionElixirPerformanceMark implements PerformanceMark {
  protected name: string
  protected running = false
  protected startValue: number
  protected endValue: number
  protected duration = 0
  protected count = 0

  constructor(name: string) {
    this.name = name
  }

  public getName(): string {
    return this.name
  }

  public isRunning(): boolean {
    return this.running
  }

  public start(): VisionElixirPerformanceMark {
    if (this.isRunning()) {
      throw new PerformanceError(
        `Measurement '${this.getName()}' already running`,
      )
    }

    this.running = true
    this.startValue = performance.now()

    return this
  }

  public stop(): number {
    if (!this.isRunning()) {
      throw new PerformanceError(`Measurement '${this.getName()}' not running`)
    }

    this.running = false
    this.endValue = performance.now()
    this.count++

    this.duration += this.endValue - this.startValue

    return this.getDuration()
  }

  public getDuration(): number {
    if (this.isRunning()) {
      throw new PerformanceError(
        `Measurement '${this.getName()}' still running`,
      )
    }

    return this.duration
  }

  public reset(): VisionElixirPerformanceMark {
    if (this.isRunning()) {
      this.stop()
    }

    this.duration = 0
    this.count = 0

    return this
  }

  public getCount(): number {
    return this.count
  }
}
