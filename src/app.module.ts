import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { ScheduleModule } from '@nestjs/schedule';

import { AjustesModule } from './ajustes/ajustes.module';
import { AlumnosModule } from './alumnos/alumnos.module';
import { AlumnosxserviciosModule } from './alumnosxservicios/alumnosxservicios.module';
import { AjustesxserviciosxalumnosModule } from './ajuestesxserviciosxalumnos/ajustesxserviciosxalumnos.module';
import { AuthModule } from './auth/auth.module';
import { OpModule } from './op/op.module';
import { RefBarriosModule } from './ref-barrios/ref-barrios.module';
import { ServiciosModule } from './servicios/servicios.module';
import { UsuariosModule } from './usuarios/usuarios.module';

import { AjustesxServiciosxAlumnosSchema } from './ajuestesxserviciosxalumnos/schemas/ajustesxserviciosxalumnos.schema';
import { ServicioSchema } from './servicios/schemas/servicio.schema';

import { AjustesxserviciosxalumnosService } from './ajuestesxserviciosxalumnos/ajustesxserviciosxalumnos.service';
import { AppService } from './app.service';
import { ServiciosService } from './servicios/servicios.service';
import { TareasService } from './tareas.service';

import { AppController } from './app.controller';
import { OpService } from './op/op.service';
import { OpSchema } from './op/schemas/op.schema';

@Module({
  imports: [ 
    AjustesModule, 
    AlumnosModule,
    AuthModule,
    ConfigModule.forRoot({ envFilePath: '.env' }), 
    MongooseModule.forRoot( process.env.MONGODB_URI_LOCAL! + process.env.MONGODB_CLUSTER_LOCAL! + process.env.MONGODB_DBNAME! , {
    //MongooseModule.forRoot(process.env.MONGODB_URI! + process.env.MONGODB_USER! + process.env.MONGODB_PASSWORD! + process.env.MONGODB_CLUSTER! + process.env.MONGODB_DBNAME! , {   
        connectionName: 'ConexionEscuelaDeDanza',
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
        useFindAndModify: false,        
    }),      
    RefBarriosModule, 
    ServiciosModule, 
    UsuariosModule, 
    AlumnosxserviciosModule, 
    AjustesxserviciosxalumnosModule, 
    MongooseModule.forFeature([
      {name: 'AjustesxServiciosxAlumnos', schema: AjustesxServiciosxAlumnosSchema}, 
      {name: 'Servicios', schema: ServicioSchema},
      {name: 'Ops', schema: OpSchema}
      ], 
      'ConexionEscuelaDeDanza' ),
    ScheduleModule.forRoot(),
    OpModule
  ],
  controllers: [
    AppController
  ],
  providers: [
    AppService,
    TareasService,
    OpService,
    ServiciosService,
    AjustesxserviciosxalumnosService
  ],
})
export class AppModule {
 

}
