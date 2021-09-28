import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { from, Observable, map } from 'rxjs';
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

  listarAjustesxServxAlumnosByFecha(fechaActual: Date): Observable<IAjustexServicioxAlumno[]>{       
    return from(this.ajustesxServxAlumnoModel.find({ estaActivo: true})
            .populate({ 
                      path: 'idAjustes', 
                      select: 'descripcion fechaDesdeValidez fechaHastaValidez',                      
                      match: { fechaDesdeValidez: { $lte: fechaActual}, fechaHastaValidez: { $gte: fechaActual} }
                      //fechaDesdeValidez <= fechaActual  match: { fechaDesdeValidez: { $lte: fechaActual}}
                      //fechaHastaValidez >= fechaActual fechaHastaValidez: { $gte: fechaActual}
                    })
            .populate({path: 'idAlumnoxServicio', populate: { path: 'idServicio', select:'tipoGeneracion' }})
            .populate({path: 'idAlumnoxServicio', populate: { path: 'idAlumno', select:'fechaNacimiento nombre' }}))
                                                                        
                .pipe(
                  map(resp=> resp as IAjustexServicioxAlumno[])
                );
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
