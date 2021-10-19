import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AlumnosxServiciosSchema } from './schemas/alumnoxservicio.schema';
import { AlumnosxServiciosService } from './alumnosxservicios.service';
import { AlumnosxServiciosController } from './alumnosxservicios.controller';

@Module({
  imports: [
    MongooseModule.forFeature([{name: 'AlumnosxServicios', schema: AlumnosxServiciosSchema}], 'ConexionEscuelaDeDanza')
  ],
  controllers: [AlumnosxServiciosController],
  providers: [AlumnosxServiciosService],  
  exports: [
    AlumnosxServiciosService
  ]
})
export class AlumnosxServiciosModule {}
