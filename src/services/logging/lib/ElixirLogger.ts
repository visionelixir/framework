import { KeyValue } from '../../app/types'
import {
  Logger,
  LoggingDriver,
  SeverityColors,
  Severity,
  GoogleCloudLoggingConfig,
} from '../types'
import { Console } from '../drivers/Console'
import { GCloud } from '../drivers/GCloud'

export class ElixirLogger implements Logger {
  protected loggingDriver: LoggingDriver
  protected logger: GCloud | Console

  public constructor(
    loggingDriver: LoggingDriver = LoggingDriver.CONSOLE,
    config: KeyValue = {},
  ) {
    this.loggingDriver = loggingDriver

    switch (loggingDriver) {
      case LoggingDriver.CONSOLE:
        this.logger = new Console()
        break
      case LoggingDriver.GCLOUD:
        this.logger = new GCloud(config as GoogleCloudLoggingConfig)
        break
      default:
        throw new Error(`Logging Driver '${loggingDriver}' does not exist`)
    }
  }

  public log(logName: string, message: string, meta?: KeyValue): ElixirLogger {
    this.render(
      logName,
      Severity.DEFAULT,
      SeverityColors.LEVEL_0,
      message,
      meta,
    )

    return this
  }

  public debug(
    logName: string,
    message: string,
    meta?: KeyValue,
  ): ElixirLogger {
    this.render(
      logName,
      Severity.DEBUG,
      SeverityColors.LEVEL_100,
      message,
      meta,
    )

    return this
  }

  public info(logName: string, message: string, meta?: KeyValue): ElixirLogger {
    this.render(logName, Severity.INFO, SeverityColors.LEVEL_200, message, meta)

    return this
  }

  public notice(
    logName: string,
    message: string,
    meta?: KeyValue,
  ): ElixirLogger {
    this.render(
      logName,
      Severity.NOTICE,
      SeverityColors.LEVEL_300,
      message,
      meta,
    )

    return this
  }

  public warning(
    logName: string,
    message: string,
    meta?: KeyValue,
  ): ElixirLogger {
    this.render(
      logName,
      Severity.WARNING,
      SeverityColors.LEVEL_400,
      message,
      meta,
    )

    return this
  }

  public error(
    logName: string,
    message: string,
    meta?: KeyValue,
  ): ElixirLogger {
    this.render(
      logName,
      Severity.ERROR,
      SeverityColors.LEVEL_500,
      message,
      meta,
    )

    return this
  }

  public critical(
    logName: string,
    message: string,
    meta?: KeyValue,
  ): ElixirLogger {
    this.render(
      logName,
      Severity.CRITICAL,
      SeverityColors.LEVEL_600,
      message,
      meta,
    )

    return this
  }

  public alert(
    logName: string,
    message: string,
    meta?: KeyValue,
  ): ElixirLogger {
    this.render(
      logName,
      Severity.ALERT,
      SeverityColors.LEVEL_700,
      message,
      meta,
    )

    return this
  }

  public emergency(
    logName: string,
    message: string,
    meta?: KeyValue,
  ): ElixirLogger {
    this.render(
      logName,
      Severity.EMERGENCY,
      SeverityColors.LEVEL_800,
      message,
      meta,
    )

    return this
  }

  protected getTimeStamp(): string {
    const now = new Date()
    const timeString = now.toISOString().split('.')[0].replace('T', ' ')

    return timeString
  }

  protected render(
    logName: string,
    severity: Severity,
    color: SeverityColors,
    message: string,
    meta?: KeyValue,
  ): void {
    this.logger.render(
      logName,
      severity,
      color,
      this.getTimeStamp(),
      message,
      meta,
    )
  }
}
