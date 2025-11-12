import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { BookingsService } from './booking.service';
import { BookingsController } from './booking.controller';
import { Booking } from './entities/booking.entity';
import { Vehicle } from '../vehicle/entities/vehicle.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Booking, Vehicle]), // ✅ on met les 2 entités ici
  ],
  controllers: [BookingsController],
  providers: [BookingsService],
})
export class BookingsModule {}
