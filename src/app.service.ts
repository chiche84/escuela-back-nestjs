import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { IAjustexServicioxAlumno } from './ajuestesxserviciosxalumnos/interfaces/ajustexservicioxalumno.interface';
import { Model } from 'mongoose';


@Injectable()
export class AppService {
  
  constructor(){}


  getHello(): string {
    return 'Hello World!!! ' + process.env.nombre;
  }

  
}
