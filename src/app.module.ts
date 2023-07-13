import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InventoryModule } from './inventory/inventory.module';
import { ShowModule } from './show/show.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      username: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DATABASE_NAME,
      synchronize: process.env.SYNCHRONIZE ? true : false,
      entities: ['dist/**/*.entity.js'],
    }),
    InventoryModule,
    ShowModule,
  ],
})
export class AppModule {}
