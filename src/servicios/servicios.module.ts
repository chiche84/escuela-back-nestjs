import { Module } from '@nestjs/common';
import { ServiciosService } from './servicios.service';
import { ServiciosController } from './servicios.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { ServicioSchema } from './schemas/servicio.schema';
import { AjustesModule } from '../ajustes/ajustes.module';

@Module({
  imports:[
    MongooseModule.forFeature([{name: 'Servicios', schema: ServicioSchema}], 'ConexionEscuelaDeDanza' ),
    AjustesModule
  ],
  controllers: [ServiciosController],
  providers: [ServiciosService]
})
export class ServiciosModule {}
