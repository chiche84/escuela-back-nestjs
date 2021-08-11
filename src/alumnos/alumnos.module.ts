import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import DataURIParser from 'datauri/parser';
import { AlumnosController } from './alumnos.controller';
import { AlumnosService } from './alumnos.service';
import { AlumnoSchema } from './schemas/alumno.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{name: 'Alumnos', schema: AlumnoSchema}], 'ConexionEscuelaDeDanza' )      
  ],
  controllers: [
    AlumnosController,
    
  ],
  providers: [
    AlumnosService,
  ]
})
export class AlumnosModule {}
