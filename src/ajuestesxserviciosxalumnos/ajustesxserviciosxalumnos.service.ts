import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { CreateAjustesxserviciosxalumnoDto } from './dto/create-ajustesxserviciosxalumno.dto';
import { Model } from 'mongoose';
import { IAjustexServicioxAlumno } from './interfaces/ajustexservicioxalumno.interface';
import { from, Observable, map } from 'rxjs';

@Injectable()
export class AjustesxserviciosxalumnosService {

  constructor(@InjectModel('AjustesxServiciosxAlumnos') private readonly ajustesxServxAlumnoModel: Model<IAjustexServicioxAlumno>){

  }
  async crearAjustexServxAlumno(createAjustesxserviciosxalumnoDto: CreateAjustesxserviciosxalumnoDto) {

    return await this.ajustesxServxAlumnoModel.create(createAjustesxserviciosxalumnoDto);
  }

  async verAjustesxServxAlumnos() {
    return await this.ajustesxServxAlumnoModel.find({ estaActivo: true}).populate({ path: 'idAjuste', select: 'descripcion'})
                                                                        .populate({path: 'idAlumnoxServicio', select: 'idAlumno idServicio'});
  }

  listarAjustesxServxAlumnos(): Observable<IAjustexServicioxAlumno[]>{
    return from(this.ajustesxServxAlumnoModel.find({ estaActivo: true}).populate({ path: 'idAjuste', select: 'descripcion'}).populate({path: 'idAlumnoxServicio', select: 'idAlumno idServicio'}))
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
