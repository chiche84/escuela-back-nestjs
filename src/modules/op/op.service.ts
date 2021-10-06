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

 
  async buscarPorAlumnoxServicioMes(idAlumnoxServicio: string, fecha:Date, idAjuste: string ){    
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
                                      fechaGeneracion: { $gte: primerDia1 , $lte: ultimoDia1},
                                      idAjustesAplicados: { $eq: idAjuste} 
                                    })
                              .populate({ path: 'idAjustesAplicados', select: 'descripcion modoAplicacion'})
                                      //.select('fechaGeneracion')                                    
                  .catch(x=> [] )   
  }

  async buscarPorAlumno(idAlumno: string){
    const resultado = await this.opsModel.find({ estaActivo: true})
                          .populate({ path: 'idAlumnoxServicioGen',  
                                      select:'idAlumno idServicio _id',
                                      match: { estaActivo: { $eq: true}, idAlumno: {$eq: idAlumno} } ,
                                      populate: [
                                                  { path: 'idServicio', select: 'descripcion precio tipoGeneracion',  match: { estaActivo: { $eq: true}} }, 
                                                  { path: 'idAlumno', select: 'apellido nombre',  match: { estaActivo: { $eq: true}} }
                                                ] 
                          })

    return resultado.filter(x=> x.idAlumnoxServicioGen != null);        
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
