import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateRefBarrioDto } from './dto/create-ref-barrio.dto';
import { IRefBarrio } from './interfaces/ref-barrio.interface';

@Injectable()
export class RefBarriosService {
  constructor( @InjectModel('RefBarrios') private readonly refBarrioModel: Model<IRefBarrio>){
  }

  async crearBarrio(createRefBarrioDto: CreateRefBarrioDto): Promise<IRefBarrio> {            
      const barrio = await this.refBarrioModel.create(createRefBarrioDto);
      return barrio.save(); 
  }

  async verBarrios(): Promise<IRefBarrio[]> {
    const barrios = await this.refBarrioModel.find({ estaActivo: true });
    return barrios;
  }

  async barrioById(id: string):Promise<IRefBarrio> {
    const barrio = await this.refBarrioModel.findById(id);
    return barrio;
  }

  async actualizarBarrio(id: string, updateRefBarrioDto: CreateRefBarrioDto): Promise<IRefBarrio>{
    let barrio =  await this.refBarrioModel.findById(id);
    if (! barrio) {
      return null;
    }
    barrio = await this.refBarrioModel.findByIdAndUpdate(id, updateRefBarrioDto, {new: true});
    return barrio;
  }

  
  async eliminarBarrio(id: string) {
    let barrio =  await this.refBarrioModel.findById(id);
    if (! barrio) {
      return null;
    }

    // const alumnos = await AlumnoModel.find({ idRefBarrio: id }, 'apellido nombre'); 
    //     if (alumnos.length > 0) {
    //         return res.status(400).json({
    //             ok: true,
    //             msj: "Hay alumnos que tienen ese barrio, no se puede eliminar",
    //             barrio: alumnos
    //         });
    //     }
    barrio.estaActivo = false;
    barrio = await this.refBarrioModel.findByIdAndUpdate(id, barrio, {new: true});
    return barrio;
  }
}
