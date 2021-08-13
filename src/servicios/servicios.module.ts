import { Module } from '@nestjs/common';
import { ServiciosService } from './servicios.service';
import { ServiciosController } from './servicios.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { ServicioSchema } from './schemas/servicio.schema';

@Module({
  imports:[
    MongooseModule.forFeature([{name: 'Servicios', schema: ServicioSchema}], 'ConexionEscuelaDeDanza' ),
  ],
  controllers: [ServiciosController],
  providers: [ServiciosService]
})
export class ServiciosModule {}
