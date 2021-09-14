import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { CreateAjuestesxserviciosxalumnoDto } from './dto/create-ajuestesxserviciosxalumno.dto';
import { Model } from 'mongoose';
import { IAjustexServicioxAlumno } from './interfaces/ajustexservicioxalumno.interface';

@Injectable()
export class AjuestesxserviciosxalumnosService {

  constructor(@InjectModel('AjustesxServiciosxAlumnos') private readonly ajustesxServxAlumnoModel: Model<IAjustexServicioxAlumno>){

  }
  async crearAjustexServxAlumno(createAjuestesxserviciosxalumnoDto: CreateAjuestesxserviciosxalumnoDto) {
    return await this.ajustesxServxAlumnoModel.create(createAjuestesxserviciosxalumnoDto);
  }

  async verAjustesxServxAlumnos() {
    return await this.ajustesxServxAlumnoModel.find({ estaActivo: true}).populate({ path: 'idAjuste', select: 'descripcion'})
                                                                        .populate({path: 'idAlumnoxServicio', select: 'idAlumno idServicio'});
  }

  findOne(id: number) {
    return `This action returns a #${id} ajuestesxserviciosxalumno`;
  }

  update(id: number, updateAjuestesxserviciosxalumnoDto: CreateAjuestesxserviciosxalumnoDto) {
    return `This action updates a #${id} ajuestesxserviciosxalumno`;
  }

  remove(id: number) {
    return `This action removes a #${id} ajuestesxserviciosxalumno`;
  }
}
