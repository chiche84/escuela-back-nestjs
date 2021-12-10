import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateAlumnosxservicioDto } from './dto/create-alumnosxservicio.dto';
import { IAlumnoxServicio } from './interfaces/alumnosxservicios.interface';

@Injectable()
export class AlumnosxServiciosService {

  constructor(@InjectModel('AlumnosxServicios') private readonly serviciosxAlumnoModel: Model<IAlumnoxServicio>){

  }

  async crearAlumnoxServicio(createAlumnosxservicioDto: CreateAlumnosxservicioDto): Promise<IAlumnoxServicio>{
    return await this.serviciosxAlumnoModel.create(createAlumnosxservicioDto);
  }

  async verAlumnosxServicios(): Promise<IAlumnoxServicio[]> {
    return await this.serviciosxAlumnoModel.find({ estaActivo: true}).populate({path: 'idAlumno', select: 'apellido nombre'})
                                                                      .populate({path: 'idServicio', select: 'descripcion' });
  }
  async alumnoxServicioById(id: string): Promise<IAlumnoxServicio[]>{
    return await this.serviciosxAlumnoModel.find({ _id: id, estaActivo: true}).populate({path: 'idAlumno', select: 'apellido nombre'}); ;
  }

  async alumnoxServicioByIdServicio(idServicio: string): Promise<IAlumnoxServicio[]>{
    return await this.serviciosxAlumnoModel.find({ idServicio: idServicio, estaActivo: true}).populate({path: 'idAlumno', select: 'apellido nombre'}); ;
  }
  
  async alumnoxServicioByIdAlumno(idAlumno: string): Promise<IAlumnoxServicio[]> {
    
    const resultado = await this.serviciosxAlumnoModel.find({ estaActivo: true, idAlumno: idAlumno}).populate({path: 'idAlumno', select: 'apellido nombre', match: { estaActivo: { $eq: true} }})
                                                                                                    .populate({path: 'idServicio', select: 'descripcion precio tipoGeneracion', match: { estaActivo: { $eq: true} }})
                                                                                                    .populate({path: 'idAjustes', select: 'descripcion monto fechaDesdeValidez fechaHastaValidez modoAplicacion', match: { estaActivo: { $eq: true} }});

    return resultado.filter(x=> x.idAlumno != null && x.idServicio != null);
  }

  async listarServxAlumnosByFechaAjustePromise(fechaActual: Date) {
    return await this.serviciosxAlumnoModel.find({estaActivo: true})
            .populate({
                      path: 'idAjustes', 
                      select: 'descripcion fechaDesdeValidez fechaHastaValidez monto modoAplicacion',                      
                      match: { fechaDesdeValidez: { $lte: fechaActual}, fechaHastaValidez: { $gte: fechaActual}, estaActivo: { $eq: true} }
                      //fechaDesdeValidez <= fechaActual  match: { fechaDesdeValidez: { $lte: fechaActual}}
                      //fechaHastaValidez >= fechaActual fechaHastaValidez: { $gte: fechaActual}
            })
            .populate({
                      path: 'idAlumno',
                      select:'fechaNacimiento nombre',
                      match: { estaActivo: { $eq: true} }           
            })
            .populate({
                      path: 'idServicio', 
                      select:'descripcion tipoGeneracion precio',
                      match: { estaActivo: { $eq: true} }
            });
  }

  async modificarAlumnoxServicio(id: string, updateAlumnosxservicioDto: CreateAlumnosxservicioDto) {
    return await this.serviciosxAlumnoModel.findByIdAndUpdate(id, updateAlumnosxservicioDto, { new: true});
  }

  async eliminarAlumnoxServicio(id: string) {
    //TODO: controlar que no debe tener servicios generados
    return `This action removes a #${id} alumnosxservicio`;
  }
}
