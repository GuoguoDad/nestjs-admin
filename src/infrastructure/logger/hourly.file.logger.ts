import * as fs from 'fs';
import * as path from 'path';
import { FileLogger } from 'typeorm';
import { LoggerOptions } from 'typeorm/logger/LoggerOptions';
import * as util from 'node:util';
import dayjs from 'dayjs';

export class HourlyFileLogger extends FileLogger {
  private logDirectory: string;

  constructor(options: LoggerOptions, logDirectory: string) {
    // 父类需要 writerOptions，传入一个占位路径避免报错（实际不会使用）
    const placeholderPath = path.join(logDirectory, 'placeholder.log');
    super(options, { logPath: placeholderPath });
    this.logDirectory = logDirectory;

    // 确保日志目录存在
    if (!fs.existsSync(this.logDirectory)) {
      fs.mkdirSync(this.logDirectory, { recursive: true });
    }
  }

  /**
   * 生成当前小时对应的日志文件路径
   * 格式：ormlogs_2026-06-09_14.log
   */
  private getCurrentLogPath(): string {
    return path.join(
      this.logDirectory,
      `ormlogs_${dayjs().format('YYYY-MM-DD_HH')}.log`,
    );
  }

  /**
   * 将 message 格式化为可读的字符串（处理对象、错误等）
   */
  private formatMessage(message: any): string {
    if (typeof message === 'string') {
      return message;
    }
    if (message instanceof Error) {
      return message.stack || message.message;
    }
    if (typeof message === 'object') {
      // 使用 util.inspect 可以显示完整对象结构，且处理循环引用
      return util.inspect(message, { depth: null, colors: false });
    }
    return String(message);
  }

  /**
   * 重写父类的 writeLog 方法，动态决定写入哪个文件
   * 注意：此方法在 TypeORM 0.3.x 中存在，若版本较低，请参考下方备选方案
   */
  protected writeLog(level: 'log' | 'info' | 'warn', message: object): void {
    const logPath = this.getCurrentLogPath();
    const dir = path.dirname(logPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    const timestamp = dayjs().format('YYYY-MM-DD HH:mm:ss:SSS');
    const formattedMessage = this.formatMessage(message);
    const logLine = `[${timestamp}] ${level.toUpperCase()}: ${formattedMessage}\n`;
    fs.appendFileSync(logPath, logLine, 'utf8');
  }
}
