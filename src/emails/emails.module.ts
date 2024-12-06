import { Module } from '@nestjs/common';
import { EmailsService } from './emails.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Email } from 'src/emails/entities/emails.entity';
import { UploadsModule } from 'src/uploads/uploads.module';
import { UploadsService } from 'src/uploads/uploads.service';

@Module({
  imports: [TypeOrmModule.forFeature([Email]), UploadsModule],
  providers: [EmailsService, UploadsService],
  exports: [EmailsService],
})
export class EmailsModule {}
