import { StaffModule } from './modules/staff/staff.module';
import { Module } from '@nestjs/common';
import { RouterModule } from '@nestjs/core';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AdminModule } from './modules/admin/admin.module';
import { IdeaModule } from './modules/ideas/idea.module';
import { MongooseModule } from '@nestjs/mongoose';
import { DatabaseModule } from './common/database_module/database.module';
import { MONGO_URI } from './configs/env';
import { TokensModule } from './modules/token/token.modulet';
import { ConfigModule } from '@nestjs/config';
import configs from './configs';
import { AuthModule } from './modules/auth/auth.module';
import { AccountsService } from './modules/accounts/accounts.service';
import { AccountsModule } from './modules/accounts/accounts.module';
import { QamModule } from './modules/qam/qam.module';
import { QacModule } from './modules/qac/qac.module';
import { DepartmentModule } from './modules/department/department.module';
import { CategoryModule } from './modules/category/category.module';
import { TagModule } from './modules/tag/tag.module';
import { ScheduleModule } from '@nestjs/schedule';
import { EventModule } from './modules/events/event.module';
import { MainModule } from './modules/main/main.module';
import {MulterModule} from "@nestjs/platform-express";
import nodemailer from 'nodemailer';
import { EmailTransporter } from './common/email/email-transporter';
import { TestController } from './test.controller';
@Module({
  imports: [
    ScheduleModule.forRoot(),

    ConfigModule.forRoot({
      isGlobal: true,
      load: [configs]
    }),
    MongooseModule.forRoot(MONGO_URI),
    DatabaseModule,
    AuthModule,
    AccountsModule,
    TokensModule,
    AdminModule,
    IdeaModule,
    StaffModule,
    QamModule,
    QacModule,
    DepartmentModule,
    CategoryModule,
    TagModule,
    IdeaModule,
    EventModule,
    MainModule,
    MulterModule.register({
      dest: '/public/assets/uploads',
    }),
  ],
  controllers: [AppController, TestController],
  providers: [
    AppService,
    EmailTransporter,
  ],
})
export class AppModule {}