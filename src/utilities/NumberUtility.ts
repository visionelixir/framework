export class NumberUtility {
  public static getRandomInt(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1) + min)
  }

  public static round(value: number, precision = 2): number {
    const factor = Math.pow(10, precision)
    const factoredValue = value * factor
    const roundedFactoredValue = Math.round(factoredValue)

    return roundedFactoredValue / factor
  }
}
