import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { config } from 'dotenv';
import { Transporter } from 'nodemailer';
import * as nodemailer from 'nodemailer';
import Mail from 'nodemailer/lib/mailer';
import { Email } from 'src/emails/entities/emails.entity';
import { UploadsService } from 'src/uploads/uploads.service';
import { LessThan, Repository } from 'typeorm';
import * as fs from 'fs';
import * as path from 'path';

config();

@Injectable()
export class EmailsService implements OnModuleInit {
  private transporter: Transporter;

  constructor(
    @InjectRepository(Email)
    private readonly emailRepository: Repository<Email>,
    private readonly uploadsService: UploadsService,
  ) {
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER!,
        pass: process.env.EMAIL_PASS!,
      },
    });
  }

  async onModuleInit() {
    await this.emailRepository.delete({
      expired_at: LessThan(new Date()),
    });
  }

  public findOneByCode = async (
    code: string,
    email: string,
  ): Promise<Email> => {
    const findCode = await this.emailRepository.findOneBy({
      verification_code: code,
      recipient: email,
    });

    return await this.emailRepository.save(findCode);
  };

  public sendVerificationCode = async (
    email: string,
    code: string,
  ): Promise<void> => {
    const htmlContent = `
      <p>Hi there,</p>
      <p>Your verification code is <strong style="font-size: 20px; color: red;">${code}</strong>.</p>
      <p>Please enter it to verify your email address.</p>
      <p style="font-size: 12px;">Note: The code will expire in 
          <strong style="font-size: 20px; color: black;">2</strong>
      minutes! Please enter it promptly.</p>
    `;

    const filePath = path.join(__dirname, `${email}/verification-email.html`);
    fs.writeFileSync(filePath, htmlContent);

    const fileBuffer = fs.readFileSync(filePath);

    const mockFile: Express.Multer.File = {
      fieldname: 'file',
      originalname: `${email}/verification-email.html`,
      encoding: '7bit',
      mimetype: 'text/html',
      size: fileBuffer.length,
      buffer: fileBuffer,
      stream: fs.createReadStream(filePath),
      filename: '',
      destination: '',
      path: '',
    };

    const { url } = await this.uploadsService.uploadFile(mockFile, 'emails');

    const mailOptions: Mail.Options = {
      from: process.env.EMAIL_USER!,
      to: email,
      subject: 'Email Update Verification Code',
      html: htmlContent,
    };

    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + 2); // verification code has expired after 2 minutes.

    const newEmail = this.emailRepository.create({
      type: 'verify',
      recipient: email,
      verification_code: code,
      content_url: url,
      sent_at: new Date(),
      expired_at: expiresAt,
    });

    await this.emailRepository.save(newEmail);

    await this.transporter.sendMail(mailOptions);
  };

  public sendResetEmail = async (email: string, token: string) => {
    const resetLink = `${process.env.RESET_PASSWORD_LINK!}/?token=${token}`;

    const htmlContent = `
        <p>Hi there,</p>
        <p>Please click below link to reset your password.</p>
        <strong style="font-size: 18px; color: #4CAF50;">${resetLink}</strong>
         <p style="font-size: 12px;">Note: The link will expire in 
          <strong style="font-size: 20px; color: black;">2</strong>
      minutes! Please click it promptly.</p>
      `;

    const filePath = path.join(__dirname, `${email}/forget-password.html`);
    fs.writeFileSync(filePath, htmlContent);

    const fileBuffer = fs.readFileSync(filePath);

    const mockFile: Express.Multer.File = {
      fieldname: 'file',
      originalname: `${email}/forget-password.html`,
      encoding: '7bit',
      mimetype: 'text/html',
      size: fileBuffer.length,
      buffer: fileBuffer,
      stream: fs.createReadStream(filePath),
      filename: '',
      destination: '',
      path: '',
    };

    const { url } = await this.uploadsService.uploadFile(mockFile, 'emails');

    const mailOptions: Mail.Options = {
      from: process.env.EMAIL_USER!,
      to: email,
      subject: 'Reset Your Password',
      html: htmlContent,
    };

    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + 2); // verification link has expired after 2 minutes.

    const newEmail = this.emailRepository.create({
      type: 'forget-password',
      recipient: email,
      verification_link: resetLink,
      content_url: url,
      sent_at: new Date(),
      expired_at: expiresAt,
    });

    await this.emailRepository.save(newEmail);

    await this.transporter.sendMail(mailOptions);
  };
}
