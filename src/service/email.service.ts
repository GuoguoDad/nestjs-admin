import { Injectable, HttpStatus } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import * as smtpTransport from 'nodemailer-smtp-transport';

import { ConfigService } from './config.service';
import { iContent, iMailOptions, iResult } from './interface/email.interface';

@Injectable()
export class EmailService {
  constructor(private readonly configService: ConfigService) {}

  sendEmail(mailConfig: iContent): Promise<iResult> {
    return new Promise((resolve, reject) => {
      const {
        transport = 'default',
        target,
        title,
        text,
        html,
        attachments,
      } = mailConfig;

      let transporter;
      const emailHost = this.configService.getString('email_host');
      const emailPort = this.configService.getNumber('email_port');
      const authUser = this.configService.getString('email_auth_user');
      const authPass = this.configService.getString('email_auth_pass');

      if (transport === 'default') {
        transporter = nodemailer.createTransport({
          host: emailHost,
          auth: { user: authUser, pass: authPass },
        });
      } else {
        transporter = nodemailer.createTransport(
          smtpTransport({
            host: emailHost,
            secure: true,
            secureConnection: true,
            port: emailPort,
            auth: { user: authUser, pass: authPass },
          }),
        );
      }

      const mailOptions: iMailOptions = {
        from: authUser,
        to: target,
        subject: title,
      };
      if (text) {
        mailOptions.text = text;
      }
      if (html) {
        mailOptions.html = html;
      }
      if (attachments) {
        mailOptions.attachments = attachments;
      }
      const result = {
        httpCode: HttpStatus.OK,
        message: '发送成功!',
      };
      try {
        transporter.sendMail(mailOptions, (err) => {
          if (err) {
            result.httpCode = HttpStatus.INTERNAL_SERVER_ERROR;
            result.message = err;

            reject(result);
          }
          resolve(result);
        });
      } catch (err) {
        result.httpCode = HttpStatus.INTERNAL_SERVER_ERROR;
        result.message = err;
        reject(result);
      }
    });
  }
}
