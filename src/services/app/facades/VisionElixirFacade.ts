import { VisionElixir } from '../lib/VisionElixir'

export const VisionElixirFacade = <T>(containerName: string): T => {
  return (new Proxy(this, {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    get: (_target: T, property: string): any => {
      if (property === 'isRegistered') {
        return VisionElixir.container().has(containerName)
      }

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const obj: any = VisionElixir.service(containerName)
      return obj[property]
    },

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    apply: (_target: any, _thisArg: any, argumentsList: any[]): any => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const obj: any = VisionElixir.service(containerName)
      return obj(...argumentsList)
    },
  }) as unknown) as T
}
