import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { ScheduleModule } from '@nestjs/schedule';

import { AjustesModule } from './modules/ajustes/ajustes.module';
import { AlumnosModule } from './modules/alumnos/alumnos.module';
import { AlumnosxServiciosModule } from './modules/alumnosxservicios/alumnosxservicios.module';
import { AuthModule } from './auth/auth.module';
import { OpModule } from './modules/op/op.module';
import { RefBarriosModule } from './modules/ref-barrios/ref-barrios.module';
import { ServiciosModule } from './modules/servicios/servicios.module';
import { UsuariosModule } from './modules/usuarios/usuarios.module';

import { ServicioSchema } from './modules/servicios/schemas/servicio.schema';

import { AppService } from './app.service';
import { ServiciosService } from './modules/servicios/servicios.service';
import { TareasService } from './tareas.service';

import { AppController } from './app.controller';
import { OpService } from './modules/op/op.service';
import { OpSchema } from './modules/op/schemas/op.schema';
import { AlumnosxServiciosService } from './modules/alumnosxservicios/alumnosxservicios.service';

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
    AlumnosxServiciosModule, 
    MongooseModule.forFeature([ 
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
    AlumnosxServiciosService,
  ],
})
export class AppModule {
 

}
