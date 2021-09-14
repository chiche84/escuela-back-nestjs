import { Module } from '@nestjs/common';
import { AjuestesxserviciosxalumnosService } from './ajuestesxserviciosxalumnos.service';
import { AjuestesxserviciosxalumnosController } from './ajuestesxserviciosxalumnos.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { AjustesxServiciosxAlumnosSchema } from './schemas/ajustesxserviciosxalumnos.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{name: 'AjustesxServiciosxAlumnos', schema: AjustesxServiciosxAlumnosSchema}], 'ConexionEscuelaDeDanza' ),
  ],
  controllers: [AjuestesxserviciosxalumnosController],
  providers: [AjuestesxserviciosxalumnosService]
})
export class AjuestesxserviciosxalumnosModule {}
