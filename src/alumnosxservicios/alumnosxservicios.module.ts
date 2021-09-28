import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AlumnosxServiciosSchema } from './schemas/alumnoxservicio.schema';
import { AlumnosxserviciosService } from './alumnosxservicios.service';
import { AlumnosxserviciosController } from './alumnosxservicios.controller';

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
