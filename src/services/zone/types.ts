import { KeyValue } from '../app/types'

export enum VisionElixirZoneEvents {
  ZONE_SETUP = 'Zone:Setup',
}

export const SERVICE_ZONE = 'zone'

export interface Zone {
  fork(data: KeyValue): Zone
  run(cb: () => Promise<void>): Promise<void>
  get<T>(key: string): T
}

export interface ZoneManager {
  getCurrentZone(): Zone
  set<T>(id: string | number, value: T): ZoneManager
  get<T>(id: string | number): T
  delete(id: string | number): ZoneManager
}
