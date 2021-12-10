import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AlumnoSchema } from './schemas/alumno.schema';
import { AlumnosService } from './alumnos.service';
import { AlumnosController } from './alumnos.controller';

@Module({
  imports: [
    MongooseModule.forFeature([{name: 'Alumnos', schema: AlumnoSchema}], 'ConexionEscuelaDeDanza' ),      
    //MongooseModule.forFeature([{name: 'AlumnosAtlas', schema: AlumnoSchema}], 'ConexionEscuelaDeDanzaAtlas' )      
  ],
  controllers: [
    AlumnosController,    
  ],
  providers: [
    AlumnosService,
  ],
  exports: [
    AlumnosService    
  ]
})
export class AlumnosModule {}
