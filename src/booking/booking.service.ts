import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DeepPartial } from 'typeorm';
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
    if (!vehicle) throw new Error('Véhicule non trouvé');

    const start = new Date(dto.startTime);
    const end = new Date(dto.endTime);

    // Calcul de la durée en minutes
    const durationMinutes = (end.getTime() - start.getTime()) / 1000 / 60;

    // Prix = basePrice * nombre de "tranches" (exemple : chaque tranche = bufferMinutes)
    const units = Math.ceil(durationMinutes / vehicle.bufferMinutes);
    const totalPrice = units * vehicle.basePriceCents;

    const booking = this.bookingRepo.create({
      vehicle: { id: vehicle.id },
      startsAt: start,
      endsAt: end,
      customerName: dto.customerName,
      customerEmail: dto.customerEmail,
      amountCents: totalPrice, // ⚠️ obligatoire
      status: 'confirmed',
    } as DeepPartial<Booking>);

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
