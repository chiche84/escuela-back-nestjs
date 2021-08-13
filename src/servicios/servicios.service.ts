import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { CreateServicioDto } from './dto/create-servicio.dto';
import { Model } from 'mongoose';
import { IServicio } from './interfaces/servicio.interface';

@Injectable()
export class ServiciosService {

  constructor(@InjectModel('Servicios') private readonly servicioModel: Model<IServicio>){

  }

  async crearServicio(createServicioDto: CreateServicioDto): Promise<IServicio> {
    return await this.servicioModel.create(createServicioDto);
  }

  async verServicios(): Promise<IServicio[]> {
    return await this.servicioModel.find({ estaActivo: true});
  }

  async servicioById(id: string): Promise<IServicio> {
    return await this.servicioModel.findById(id);
  }

  async modificarServicio(id: string, updateServicioDto: CreateServicioDto): Promise<IServicio> {
    return await this.servicioModel.findByIdAndUpdate(id, updateServicioDto, {new: true});
  }

  async eliminarServicio(id: string): Promise<any> {
    //TODO: controlo dependencias antes de eliminar:
    //alumnosxservicio
    return await this.servicioModel.findByIdAndUpdate(id, { estaActivo: false }, {new: true});
  }
}
