import { KeyValue } from '../app/types'

export enum VisionElixirZoneEvents {
  ZONE_SETUP = 'Zone:Setup',
}

export const SERVICE_ZONE = 'zone'

export interface Zone {
  fork(data: KeyValue): Zone
  run(cb: () => Promise<void>): any
  get<T>(key: string): T
}

export interface ZoneManager {
  getCurrentZone(): Zone
  set(id: string | number, value: any): ZoneManager
  get(id: string | number): any
  delete(id: string | number): ZoneManager
}
