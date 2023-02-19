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

console.log(`MONGO_URI: ${MONGO_URI}`);

@Module({
  imports: [
    MongooseModule.forRoot(MONGO_URI),
    DatabaseModule,
    AuthModule,
    AccountsModule,
    TokensModule,
    AdminModule,
    IdeaModule,
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configs]
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
