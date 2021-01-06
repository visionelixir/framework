export interface PerformanceMarkCollection {
  [id: string]: PerformanceMark
}

export interface PerformanceMark {
  getName(): string
  isRunning(): boolean
  stop(): number
  getDuration(): number
  reset(): PerformanceMark
  getCount(): number
}

export interface Performance {
  start(name: string): Performance
  stop(name: string): Performance
  get(name: string): PerformanceMark
  all(): PerformanceMarkCollection
  allArray(): PerformanceMark[]
  clear(name?: string): Performance
  clearAll(): Performance
}

export const SERVICE_PERFORMANCE = 'performance'
