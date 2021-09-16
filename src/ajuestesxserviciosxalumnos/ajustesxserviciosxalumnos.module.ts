import { Module } from '@nestjs/common';
import { AjustesxserviciosxalumnosService } from './ajustesxserviciosxalumnos.service';
import { AjustesxserviciosxalumnosController } from './ajustesxserviciosxalumnos.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { AjustesxServiciosxAlumnosSchema } from './schemas/ajustesxserviciosxalumnos.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{name: 'AjustesxServiciosxAlumnos', schema: AjustesxServiciosxAlumnosSchema}], 'ConexionEscuelaDeDanza' ),
  ],
  controllers: [AjustesxserviciosxalumnosController],
  providers: [AjustesxserviciosxalumnosService]
})
export class AjustesxserviciosxalumnosModule {}
