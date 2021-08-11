import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AlumnosModule } from './alumnos/alumnos.module';
import { MongooseModule } from '@nestjs/mongoose';
import { RefBarriosModule } from './ref-barrios/ref-barrios.module';

@Module({
  imports: [ 
    AlumnosModule,
    ConfigModule.forRoot({ envFilePath: '.env' }), 
    //MongooseModule.forRoot( process.env.MONGODB_URI_LOCAL! + process.env.MONGODB_CLUSTER_LOCAL! + process.env.MONGODB_DBNAME! , {
    MongooseModule.forRoot(process.env.MONGODB_URI! + process.env.MONGODB_USER! + process.env.MONGODB_PASSWORD! + process.env.MONGODB_CLUSTER! + process.env.MONGODB_DBNAME! , {   
      connectionName: 'ConexionEscuelaDeDanza',
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
        useFindAndModify: false
    }),      
    RefBarriosModule,
  ],
  controllers: [
    AppController
  ],
  providers: [
    AppService
  ],
})
export class AppModule {}
