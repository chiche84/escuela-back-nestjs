import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { from, Observable } from 'rxjs';
import { CreateServicioDto } from './dto/create-servicio.dto';
import { IServicio } from './interfaces/servicio.interface';
import { IAjuste } from '../ajustes/interfaces/ajuste.interface';
import { IAlumnoxServicio } from '../alumnosxservicios/interfaces/alumnosxservicios.interface';
import { AjustesService } from '../ajustes/ajustes.service';
import { AlumnosxServiciosService } from '../alumnosxservicios/alumnosxservicios.service';

@Injectable()
export class ServiciosService {

  constructor(@InjectModel('Servicios') private readonly servicioModel: Model<IServicio>,
              private readonly ajustesServicio: AjustesService,
              private readonly alumnosxServiciosServicio: AlumnosxServiciosService){

  }

  async crearServicio(createServicioDto: CreateServicioDto): Promise<IServicio> {
    return await this.servicioModel.create(createServicioDto);
  }

  async verServicios(): Promise<IServicio[]> {
    return await this.servicioModel.find({ estaActivo: true});
  }

  servicioById(id: string): Observable<IServicio> {
    return from(this.servicioModel.findById(id));
  }

  async modificarServicio(id: string, updateServicioDto: CreateServicioDto): Promise<IServicio> {
    return await this.servicioModel.findByIdAndUpdate(id, updateServicioDto, {new: true});
  }

  async eliminarServicio(id: string): Promise<any> {
    //TODO: controlo dependencias antes de eliminar:   
    
    //const alumnosxservicio = await this.serviciosxAlumnoModel.find({ idServicio: id, estaActivo: true }, '').populate({path: 'idAlumno', select: 'apellido nombre'}); 
    const alumnosxservicio = await this.alumnosxServiciosServicio.alumnoxServicioByIdServicio(id);
    if (alumnosxservicio.length > 0) {
        return {
            ok: false,
            msj: "Hay alumnos que tienen ese Servicio, no se puede eliminar",
            alumnosxservicio
        };
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
