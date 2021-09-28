import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateAlumnosxservicioDto } from './dto/create-alumnosxservicio.dto';
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

  async alumnoxServicioByIdAlumno(idAlumno: string): Promise<IAlumnoxServicio[]> {
    return await this.serviciosxAlumnoModel.find({ estaActivo: true, idAlumno: idAlumno}).populate({path: 'idAlumno', select: 'apellido nombre'})
                                                                                          .populate({path: 'idServicio', select: 'descripcion' });
  }

  async modificarAlumnoxServicio(id: string, updateAlumnosxservicioDto: CreateAlumnosxservicioDto) {
    return await this.serviciosxAlumnoModel.findByIdAndUpdate(id, updateAlumnosxservicioDto, { new: true});
  }

  async eliminarAlumnoxServicio(id: string) {
    //TODO: controlar que no debe tener servicios generados
    return `This action removes a #${id} alumnosxservicio`;
  }
}
