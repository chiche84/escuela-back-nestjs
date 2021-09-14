import { PartialType } from '@nestjs/mapped-types';
import { CreateAlumnosxservicioDto } from './create-alumnosxservicio.dto';

export class UpdateAlumnosxservicioDto extends PartialType(CreateAlumnosxservicioDto) {}
