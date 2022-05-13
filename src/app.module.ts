import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host:  process.env.DB_HOST,
      database:  process.env.DB_NAME,
      password:  process.env.DB_PASSWORD,
      username:  process.env.DB_USER,
      port: parseInt( process.env.DB_PORT),
      synchronize:  process.env.NODE_ENV === 'development',
      //entities: [__dirname + '/../**/*.entity.{js,ts}'],
      autoLoadEntities: true,
    }),
    AuthModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
