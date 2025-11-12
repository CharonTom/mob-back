import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { Booking } from './entities/booking.entity';
import { Vehicle } from '../vehicle/entities/vehicle.entity';
import { CreateBookingDto } from './dto/create-booking.dto';

@Injectable()
export class BookingsService {
  constructor(
    @InjectRepository(Booking)
    private readonly bookingRepo: Repository<Booking>,
    @InjectRepository(Vehicle)
    private readonly vehicleRepo: Repository<Vehicle>,
  ) {}

  async create(dto: CreateBookingDto) {
    const vehicle = await this.vehicleRepo.findOne({
      where: { id: dto.vehicleId },
    });
    if (!vehicle) throw new BadRequestException('Vehicle not found');

    const start = new Date(dto.startTime);
    const end = new Date(dto.endTime);

    // Vérifier disponibilité en tenant compte du bufferMinutes
    const bufferMs = vehicle.bufferMinutes * 60 * 1000;
    const overlapping = await this.bookingRepo.findOne({
      where: {
        vehicle: { id: vehicle.id },
        startTime: Between(
          new Date(start.getTime() - bufferMs),
          new Date(end.getTime() + bufferMs),
        ),
      },
    });
    if (overlapping)
      throw new BadRequestException(
        'Vehicle is not available in this time slot',
      );

    // Calcul prix simple : basePriceCents (on pourra ajouter durée plus tard)
    const totalPrice = vehicle.basePriceCents;

    const booking = this.bookingRepo.create({
      vehicle,
      startTime: start,
      endTime: end,
      totalPriceCents: totalPrice,
      status: 'confirmed',
    });
    return this.bookingRepo.save(booking);
  }

  findAll() {
    return this.bookingRepo.find({ relations: ['vehicle'] });
  }

  findOne(id: string) {
    return this.bookingRepo.findOne({ where: { id }, relations: ['vehicle'] });
  }

  async cancel(id: string) {
    const booking = await this.bookingRepo.findOne({ where: { id } });
    if (!booking) throw new BadRequestException('Booking not found');
    booking.status = 'cancelled';
    return this.bookingRepo.save(booking);
  }
}
