import { Observable, of } from 'rxjs';
import { Injectable } from '@nestjs/common';
import { CreateOpDto } from './dto/create-op.dto';
import { UpdateOpDto } from './dto/update-op.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Iop } from './interfaces/op.interface';

@Injectable()
export class OpService {

  constructor(@InjectModel('Ops') private readonly opsModel: Model<Iop>){}

  async crearOp(createOpDto: CreateOpDto) {
    return await this.opsModel.create(createOpDto);
  }

  crearOPObser(createOpDto: CreateOpDto) {
    return of(this.opsModel.create(createOpDto));
  }

  async buscarPorServicioAlumnoMes(idAlumno: string, idServicio: string, fecha:Date ){
   
    let y = fecha.getFullYear(), m = fecha.getMonth();
    let primerDia = new Date(y, m, 1);
    let ultimoDia = new Date(y, m + 1, 0);

    return await this.opsModel.find({ estaActivo:true, fechaGeneracion: { $gte: primerDia , $lte: ultimoDia} })
                                                          .populate({ path: 'idAlumnoxServicio', populate:  { 
                                                                      path: 'idServicio', select:'tipoGeneracion precio',
                                                                      match: { estaActivo: { $eq: true}, _id: {$eq: idServicio} }
                                                                    }
                                                          })
                                                          .populate({ path: 'idAlumnoxServicio', populate: { 
                                                                      path: 'idAlumno', select:'fechaNacimiento nombre',
                                                                      match: { estaActivo: { $eq: true}, _id: {$eq: idAlumno} } 
                                                                      }
                                                          }).catch(x=> [] )                        
  }

  async buscarPorAlumnoxServicioMes(idAlumnoxServicio: string, fecha:Date ){    
    let miliseg = Date.parse(fecha.toString());
    let fechaChe = new Date(miliseg)
    
    let y = fechaChe.getFullYear();    
    let m = fechaChe.getMonth();
    let primerDia = Date.parse(new Date(y, m, 1).toISOString());    
    let ultimoDia = Date.parse(new Date(y, m + 1, 0,23,59,59).toISOString());    
    let primerDia1 = new Date(primerDia);
    let ultimoDia1 = new Date(ultimoDia);
    return await this.opsModel.find({ estaActivo:true, 
                                      idAlumnoxServicioGen: { $eq: idAlumnoxServicio}, 
                                      fechaGeneracion: { $gte: primerDia1 , $lte: ultimoDia1} }).select('fechaGeneracion')                                    
                  .catch(x=> [] )   
  }

  async buscarPorAlumno(idAlumno: string){
    return await this.opsModel.find({ estaActivo: true })
                          .populate({ path: 'idAlumnoxServicio', 
                                      populate: { 
                                        path: 'idAlumno', select:'fechaNacimiento nombre apellido',
                                        match: { estaActivo: { $eq: true}, _id: {$eq: idAlumno} } 
                                      }
                          });
  }

  findAll() {
    return `This action returns all op`;
  }
  
  findOne(id: number) {
    return `This action returns a #${id} op`;
  }

  update(id: number, updateOpDto: UpdateOpDto) {
    return `This action updates a #${id} op`;
  }

  remove(id: number) {
    return `This action removes a #${id} op`;
  }
}
