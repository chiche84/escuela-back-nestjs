import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { ScheduleModule } from '@nestjs/schedule';

import { AjustesModule } from './modules/ajustes/ajustes.module';
import { AlumnosModule } from './modules/alumnos/alumnos.module';
import { AlumnosxServiciosModule } from './modules/alumnosxservicios/alumnosxservicios.module';
import { AuthModule } from './auth/auth.module';
import { OpModule } from './modules/op/op.module';
import { PagosModule } from './modules/pagos/pagos.module';
import { RefBarriosModule } from './modules/ref-barrios/ref-barrios.module';
import { ServiciosModule } from './modules/servicios/servicios.module';
import { UsuariosModule } from './modules/usuarios/usuarios.module';

import { AlumnosxServiciosSchema } from './modules/alumnosxservicios/schemas/alumnoxservicio.schema';
import { OpSchema } from './modules/op/schemas/op.schema';
import { ServicioSchema } from './modules/servicios/schemas/servicio.schema';

import { AlumnosxServiciosService } from './modules/alumnosxservicios/alumnosxservicios.service';
import { AppService } from './app.service';
import { OpService } from './modules/op/op.service';
import { ServiciosService } from './modules/servicios/servicios.service';
import { TareasService } from './tareas.service';

import { AppController } from './app.controller';


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
    }),          
    RefBarriosModule, 
    ServiciosModule, 
    UsuariosModule, 
    AlumnosxServiciosModule,     
    MongooseModule.forFeature([ 
      {name: 'Servicios', schema: ServicioSchema},
      {name: 'Ops', schema: OpSchema},
      { name: 'AlumnosxServicios', schema: AlumnosxServiciosSchema}
      ], 
      'ConexionEscuelaDeDanza' ), //uso esto para el tareas.service... ver de despues ponerlo en un modulo aparte...
    ScheduleModule.forRoot(),
    OpModule,
    PagosModule
  ],
  controllers: [
    AppController,    
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
