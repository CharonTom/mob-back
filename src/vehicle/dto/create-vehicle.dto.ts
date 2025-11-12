import { IsEnum, IsInt, IsString, Min } from 'class-validator';

export class CreateVehicleDto {
  @IsString()
  name: string;

  @IsEnum(['electric', 'thermal'])
  type: 'electric' | 'thermal';

  @IsInt()
  @Min(0)
  basePriceCents: number;

  @IsInt()
  @Min(0)
  bufferMinutes: number;
}
