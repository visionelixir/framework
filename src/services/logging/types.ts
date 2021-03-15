import { KeyValue } from '../app/types'

export enum SeverityColors {
  LEVEL_0 = '#666666',
  LEVEL_100 = '#999999',
  LEVEL_200 = '#ffffff',
  LEVEL_300 = '#9ebf16',
  LEVEL_400 = '#ffff00',
  LEVEL_500 = '#f39c11',
  LEVEL_600 = '#c1392b',
  LEVEL_700 = '#31b5e0',
  LEVEL_800 = '#9b4ed4',
  STAMP = '#666666',
  MESSAGE = '#CCCCCC',
}

export enum Severity {
  DEFAULT = 0, // The log entry has no assigned severity level.
  DEBUG = 100, // Debug or trace information.
  INFO = 200, // Routine information, such as ongoing status or performance.
  NOTICE = 300, // Normal but significant events, such as start up, shut down, or a configuration change.
  WARNING = 400, // Warning events might cause problems.
  ERROR = 500, // Error events are likely to cause problems.
  CRITICAL = 600, // Critical events cause more severe problems or outages.
  ALERT = 700, // A person must take an action immediately.
  EMERGENCY = 800, // One or more systems are unusable.
}

export interface Logger {
  log(logName: string, message: string, meta?: KeyValue): Logger
  debug(logName: string, message: string, meta?: KeyValue): Logger
  info(logName: string, message: string, meta?: KeyValue): Logger
  notice(logName: string, message: string, meta?: KeyValue): Logger
  warning(logName: string, message: string, meta?: KeyValue): Logger
  error(logName: string, message: string, meta?: KeyValue): Logger
  critical(logName: string, message: string, meta?: KeyValue): Logger
  alert(logName: string, message: string, meta?: KeyValue): Logger
  emergency(logName: string, message: string, meta?: KeyValue): Logger
}

export enum LoggingDriver {
  CONSOLE = 'console',
  GCLOUD = 'gcloud',
}

export interface GoogleCloudLoggingConfig {
  projectId: string
  logging: {
    resource: {
      type: string
      labels?: {
        module_id?: string
        function_name?: string
      }
    }
  }
}

export interface LoggingConfig {
  type: LoggingDriver
  googleCloud?: GoogleCloudLoggingConfig
}

export const SERVICE_LOGGER = 'logger'

// add the logger to the VE config declaration
declare module '../app/types' {
  interface VisionElixirConfig {
    logging?: LoggingConfig
  }
}

// add the logger to the VE job config declaration
declare module '../app/types' {
  interface VisionElixirJobConfig {
    logging?: LoggingConfig
  }
}
