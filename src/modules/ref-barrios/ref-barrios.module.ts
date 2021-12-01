import { RefBarrios1 } from './entities/ref-barrios.entity';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AlumnosModule } from '../alumnos/alumnos.module';
import { RefBarrioSchema } from './schemas/ref-barrio.schema';
import { RefBarriosService } from './ref-barrios.service';
import { RefBarriosController } from './ref-barrios.controller';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports:[
      MongooseModule.forFeature([{name: 'RefBarrios', schema: RefBarrioSchema}], 'ConexionEscuelaDeDanza' ),
      TypeOrmModule.forFeature([RefBarrios1]),
      AlumnosModule
  ],
  controllers: [RefBarriosController],
  providers: [RefBarriosService]
})
export class RefBarriosModule {}
