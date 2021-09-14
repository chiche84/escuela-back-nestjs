import { Module } from '@nestjs/common';
import { AlumnosxserviciosService } from './alumnosxservicios.service';
import { AlumnosxserviciosController } from './alumnosxservicios.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { AlumnosxServiciosSchema } from './schemas/alumnoxservicio.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{name: 'AlumnosxServicios', schema: AlumnosxServiciosSchema}], 'ConexionEscuelaDeDanza')
  ],
  controllers: [AlumnosxserviciosController],
  providers: [AlumnosxserviciosService],
  exports: [
    MongooseModule.forFeature([{name: 'AlumnosxServicios', schema: AlumnosxServiciosSchema}], 'ConexionEscuelaDeDanza')
  ]
})
export class AlumnosxserviciosModule {}
