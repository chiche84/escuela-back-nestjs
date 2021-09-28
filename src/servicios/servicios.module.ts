import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AjustesModule } from '../ajustes/ajustes.module';
import { AlumnosxserviciosModule } from '../alumnosxservicios/alumnosxservicios.module';
import { ServicioSchema } from './schemas/servicio.schema';
import { ServiciosService } from './servicios.service';
import { ServiciosController } from './servicios.controller';

@Module({
  imports:[
    MongooseModule.forFeature([{name: 'Servicios', schema: ServicioSchema}], 'ConexionEscuelaDeDanza' ),
    AjustesModule,
    AlumnosxserviciosModule
  ],
  controllers: [ServiciosController],
  providers: [ServiciosService],
})
export class ServiciosModule {}
