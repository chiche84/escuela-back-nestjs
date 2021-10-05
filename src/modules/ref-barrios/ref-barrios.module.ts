import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AlumnosModule } from '../alumnos/alumnos.module';
import { RefBarrioSchema } from './schemas/ref-barrio.schema';
import { RefBarriosService } from './ref-barrios.service';
import { RefBarriosController } from './ref-barrios.controller';

@Module({
  imports:[
      MongooseModule.forFeature([{name: 'RefBarrios', schema: RefBarrioSchema}], 'ConexionEscuelaDeDanza' ),
      AlumnosModule
  ],
  controllers: [RefBarriosController],
  providers: [RefBarriosService]
})
export class RefBarriosModule {}
