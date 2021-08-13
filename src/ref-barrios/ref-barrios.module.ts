import { Module } from '@nestjs/common';
import { RefBarriosService } from './ref-barrios.service';
import { RefBarriosController } from './ref-barrios.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { RefBarrioSchema } from './schemas/ref-barrio.schema';
import { AlumnosModule } from '../alumnos/alumnos.module';

@Module({
  imports:[
      MongooseModule.forFeature([{name: 'RefBarrios', schema: RefBarrioSchema}], 'ConexionEscuelaDeDanza' ),
      AlumnosModule
  ],
  controllers: [RefBarriosController],
  providers: [RefBarriosService]
})
export class RefBarriosModule {}
