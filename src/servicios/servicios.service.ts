import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { CreateServicioDto } from './dto/create-servicio.dto';
import { Model } from 'mongoose';
import { IServicio } from './interfaces/servicio.interface';
import { IAjuste } from '../ajustes/interfaces/ajuste.interface';

@Injectable()
export class ServiciosService {

  constructor(@InjectModel('Servicios') private readonly servicioModel: Model<IServicio>,
              @InjectModel('Ajustes') private readonly ajusteModel: Model<IAjuste>){

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
    
    const ajustes =  await this.ajusteModel.find({ idServicioAfectado: id, estaActivo: true}, 'descripcion monto fechaDesdeValidez fechaHastaValidez');
    if (ajustes.length > 0) {
      return {
        ok: false,
        msj: "Hay ajustes que hacen referencia a ese Servicio, no se puede eliminar",
        ajustes
      }
    }
    
    const servicioEliminado = await this.servicioModel.findByIdAndUpdate(id, { estaActivo: false }, {new: true});    
    if (servicioEliminado) {
      return {
        ok: true,
        msj: "Servicio Eliminado",
        servicioEliminado
      };
    } 
    return null;
  }
}
