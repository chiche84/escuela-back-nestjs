import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AlumnoSchema } from './schemas/alumno.schema';
import { AlumnosService } from './alumnos.service';
import { AlumnosController } from './alumnos.controller';

@Module({
  imports: [
    MongooseModule.forFeature([{name: 'Alumnos', schema: AlumnoSchema}], 'ConexionEscuelaDeDanza' )      
  ],
  controllers: [
    AlumnosController,    
  ],
  providers: [
    AlumnosService,
  ],
  exports: [
    MongooseModule.forFeature([{name: 'Alumnos', schema: AlumnoSchema}], 'ConexionEscuelaDeDanza' )  
  ]
})
export class AlumnosModule {}
