import { IsUUID, IsDateString } from 'class-validator';

export class CreateBookingDto {
  @IsUUID()
  vehicleId: string;

  @IsDateString()
  startTime: string; // ISO string

  @IsDateString()
  endTime: string; // ISO string
}
