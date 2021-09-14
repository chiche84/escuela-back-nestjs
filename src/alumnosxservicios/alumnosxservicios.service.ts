import { Injectable } from '@nestjs/common';
import { CreateAlumnosxservicioDto } from './dto/create-alumnosxservicio.dto';
import { UpdateAlumnosxservicioDto } from './dto/update-alumnosxservicio.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { IAlumnoxServicio } from './interfaces/alumnosxservicios.interface';

@Injectable()
export class AlumnosxserviciosService {

  constructor(@InjectModel('AlumnosxServicios') private readonly serviciosxAlumnoModel: Model<IAlumnoxServicio>){

  }

  async crearAlumnoxServicio(createAlumnosxservicioDto: CreateAlumnosxservicioDto): Promise<IAlumnoxServicio>{
    return await this.serviciosxAlumnoModel.create(createAlumnosxservicioDto);
  }

  async verAlumnosxServicios(): Promise<IAlumnoxServicio[]> {
    return await this.serviciosxAlumnoModel.find({ estaActivo: true}).populate({path: 'idAlumno', select: 'apellido nombre'})
                                                                      .populate({path: 'idServicio', select: 'descripcion' });
  }

  findOne(id: number) {
    return `This action returns a #${id} alumnosxservicio`;
  }

  update(id: number, updateAlumnosxservicioDto: UpdateAlumnosxservicioDto) {
    return `This action updates a #${id} alumnosxservicio`;
  }

  remove(id: number) {
    return `This action removes a #${id} alumnosxservicio`;
  }
}
