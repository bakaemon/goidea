import { Module } from '@nestjs/common';
import { RouterModule } from '@nestjs/core';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AdminModule } from './modules/roles/admin.module';
import { UserModule } from './modules/features/users.module';
import { CreateUsersModule } from './modules/features/CreateUsers.module';

@Module({
  imports: [
    AdminModule,
    UserModule,
    CreateUsersModule,
    RouterModule.register([
      {
        path: 'admin',
        module: AdminModule,
        children: [
          {
          path: 'users',
          module: UserModule,
          },
          {
            path: 'createUsers',
            module: CreateUsersModule,
          }
        ]
      },
    ])
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
