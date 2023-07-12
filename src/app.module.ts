import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InventoryModule } from './inventory/inventory.module';

@Module({
  imports: [
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
  ],
})
export class AppModule {}
