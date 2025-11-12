import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Vehicle } from './entities/vehicle.entity';
import { CreateVehicleDto } from './dto/create-vehicle.dto';
import { UpdateVehicleDto } from './dto/update-vehicle.dto';

@Injectable()
export class VehiclesService {
  constructor(
    @InjectRepository(Vehicle)
    private readonly vehicleRepo: Repository<Vehicle>,
  ) {}

  create(dto: CreateVehicleDto) {
    const vehicle = this.vehicleRepo.create(dto);
    return this.vehicleRepo.save(vehicle);
  }

  findAll() {
    return this.vehicleRepo.find();
  }

  findOne(id: string) {
    return this.vehicleRepo.findOne({ where: { id } });
  }

  async update(id: string, dto: UpdateVehicleDto) {
    await this.vehicleRepo.update(id, dto);
    return this.findOne(id);
  }

  remove(id: string) {
    return this.vehicleRepo.delete(id);
  }
}
