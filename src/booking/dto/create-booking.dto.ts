import { IsUUID, IsDateString, IsEmail, IsString } from 'class-validator';

export class CreateBookingDto {
  @IsUUID()
  vehicleId: string;

  @IsDateString()
  startTime: string;

  @IsDateString()
  endTime: string;

  @IsString()
  customerName: string;

  @IsEmail()
  customerEmail: string;
}
