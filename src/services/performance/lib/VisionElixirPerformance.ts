import {
  PerformanceMarkCollection,
  Performance,
  PerformanceMark,
} from '../types'
import { VisionElixirPerformanceMark } from './VisionElixirPerformanceMark'
import { PerformanceError } from '../errors/PerformanceError'

export class VisionElixirPerformance implements Performance {
  protected benchmarks: PerformanceMarkCollection = {}

  public start = (name: string): VisionElixirPerformance => {
    this.benchmarks[name] = new VisionElixirPerformanceMark(name).start()

    return this
  }

  public stop = (name: string): VisionElixirPerformance => {
    this.get(name).stop()

    return this
  }

  public get = (name: string): PerformanceMark => {
    if (!this.benchmarks[name]) {
      throw new PerformanceError(`Benchmark '${name}' not set`)
    }

    return this.benchmarks[name]
  }

  public all = (): PerformanceMarkCollection => {
    return this.benchmarks
  }

  public allArray = (): PerformanceMark[] => {
    const array: PerformanceMark[] = []

    for (const i in this.benchmarks) {
      const benchmark: PerformanceMark = this.benchmarks[i]

      array.push(benchmark)
    }

    return array
  }

  public clear = (name: string): VisionElixirPerformance => {
    if (this.get(name).isRunning()) {
      this.get(name).stop()
    }

    delete this.benchmarks[name]

    return this
  }

  public clearAll = (): VisionElixirPerformance => {
    this.allArray().map((mark) => {
      if (mark.isRunning()) {
        mark.stop()
      }
    })
    this.benchmarks = {}

    return this
  }
}
