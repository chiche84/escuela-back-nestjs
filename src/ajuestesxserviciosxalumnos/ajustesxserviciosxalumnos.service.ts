import { VistaServiciosAjustes } from './../tareas.service';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { from, Observable, map, of } from 'rxjs';
import { CreateAjustesxserviciosxalumnoDto } from './dto/create-ajustesxserviciosxalumno.dto';
import { IAjustexServicioxAlumno } from './interfaces/ajustexservicioxalumno.interface';

@Injectable()
export class AjustesxserviciosxalumnosService {

  constructor(@InjectModel('AjustesxServiciosxAlumnos') private readonly ajustesxServxAlumnoModel: Model<IAjustexServicioxAlumno>){

  }
  async crearAjustexServxAlumno(createAjustesxserviciosxalumnoDto: CreateAjustesxserviciosxalumnoDto) {

    return await this.ajustesxServxAlumnoModel.create(createAjustesxserviciosxalumnoDto);
  }

  async verAjustesxServxAlumnos() {
    return await this.ajustesxServxAlumnoModel.find({ estaActivo: true}).populate({ path: 'idAjustes', select: 'descripcion'})
                                                                        .populate({path: 'idAlumnoxServicio', select: 'idAlumno idServicio'});
  }

  listarAjustesxServxAlumnosByFecha(fechaActual: Date): Observable<VistaServiciosAjustes[]>{       
    return from(this.ajustesxServxAlumnoModel.find({ estaActivo: true})
            .populate({ 
                      path: 'idAjustes', 
                      select: 'descripcion fechaDesdeValidez fechaHastaValidez',                      
                      match: { fechaDesdeValidez: { $lte: fechaActual}, fechaHastaValidez: { $gte: fechaActual}, estaActivo: { $eq: true} }
                      //fechaDesdeValidez <= fechaActual  match: { fechaDesdeValidez: { $lte: fechaActual}}
                      //fechaHastaValidez >= fechaActual fechaHastaValidez: { $gte: fechaActual}
                    })
            .populate({
                      path: 'idAlumnoxServicio', populate:  { 
                                                            path: 'idServicio', select:'tipoGeneracion precio',
                                                            match: { estaActivo: { $eq: true} }
                                                            }
                      })
            .populate({path: 'idAlumnoxServicio', populate: { 
                                                            path: 'idAlumno', select:'fechaNacimiento nombre',
                                                            match: { estaActivo: { $eq: true} } 
                                                            }
                      }))                                                                        
                .pipe(
                  map(resp=> resp as any[])
                );
  }

  async listarAjustesxServxAlumnosByFechaPromise(fechaActual: Date) {       
    return await this.ajustesxServxAlumnoModel.find({ estaActivo: true})
            .populate({ 
                      path: 'idAjustes', 
                      select: 'descripcion fechaDesdeValidez fechaHastaValidez',                      
                      match: { fechaDesdeValidez: { $lte: fechaActual}, fechaHastaValidez: { $gte: fechaActual}, estaActivo: { $eq: true} }
                      //fechaDesdeValidez <= fechaActual  match: { fechaDesdeValidez: { $lte: fechaActual}}
                      //fechaHastaValidez >= fechaActual fechaHastaValidez: { $gte: fechaActual}
                    })
            .populate({
                      path: 'idAlumnoxServicio', populate:  { 
                                                            path: 'idServicio', select:'tipoGeneracion precio',
                                                            match: { estaActivo: { $eq: true} }
                                                            }
                      })
            .populate({path: 'idAlumnoxServicio', populate: { 
                                                            path: 'idAlumno', select:'fechaNacimiento nombre',
                                                            match: { estaActivo: { $eq: true} } 
                                                            }
                      });
  }

  findOne(id: number) {
    return `This action returns a #${id} ajuestesxserviciosxalumno`;
  }

  update(id: number, updateAjuestesxserviciosxalumnoDto: CreateAjustesxserviciosxalumnoDto) {
    return `This action updates a #${id} ajuestesxserviciosxalumno`;
  }

  remove(id: number) {
    return `This action removes a #${id} ajuestesxserviciosxalumno`;
  }
}
