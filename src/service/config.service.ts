import { Injectable } from '@nestjs/common';
import * as dotenv from 'dotenv';
import * as fs from 'fs';
import * as path from 'path';
import { EnvConfig } from './interface/config.interface';

@Injectable()
export class ConfigService {
  private readonly envConfig: EnvConfig;

  constructor() {
    const filePath = `${process.env.NODE_ENV || 'dev'}.env`;
    const envFile = path.resolve(__dirname, '../../config', filePath);
    this.envConfig = dotenv.parse(fs.readFileSync(envFile));
  }

  getString(key: string): string {
    return this.envConfig[key];
  }

  getNumber(key: string): number {
    return parseInt(this.envConfig[key]);
  }
}
