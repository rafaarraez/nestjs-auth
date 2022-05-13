import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import database from './config/database';
import jwt from './config/jwt';

@Module({
  imports: [
     ConfigModule.forRoot({
      load: [database, jwt],
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => configService.get('typeorm') as TypeOrmModuleOptions,
    }),
    AuthModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
