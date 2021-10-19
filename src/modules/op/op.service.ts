import { Observable, of } from 'rxjs';
import { Injectable } from '@nestjs/common';
import { CreateOpDto } from './dto/create-op.dto';
import { UpdateOpDto } from './dto/update-op.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Iop } from './interfaces/op.interface';
import * as mongoose from 'mongoose';

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

  
  async buscarPorEstadoAlumno(estado?: 'impago' | 'pagado' | 'todos', idAlumno?: string){

    let consulta = {}
    if (idAlumno) {
      consulta = { path: 'idAlumnoxServicioGen',  
                          select:'idAlumno idServicio _id',
                          match: { estaActivo: { $eq: true}, idAlumno: {$eq: idAlumno} },
                          populate: [
                                      { path: 'idServicio', select: 'descripcion precio tipoGeneracion',  match: { estaActivo: { $eq: true}} }, 
                                      { path: 'idAlumno', select: 'apellido nombre',  match: { estaActivo: { $eq: true}} }
                                    ] 
                  }

    }else{
      consulta = { path: 'idAlumnoxServicioGen',  
                          select:'idAlumno idServicio _id',
                          match: { estaActivo: { $eq: true} },
                          populate: [
                                      { path: 'idServicio', select: 'descripcion precio tipoGeneracion',  match: { estaActivo: { $eq: true}} }, 
                                      { path: 'idAlumno', select: 'apellido nombre',  match: { estaActivo: { $eq: true}} }
                                    ] 
                  }
    }
    const resultado = await this.opsModel.find({ estaActivo: true})
                        .populate(consulta)
                        .populate({path: 'idAjustesAplicados', select: 'descripcion monto fechaDesdeValidez fechaHastaValidez modoAplicacion', match: { estaActivo: { $eq: true} }});
    switch (estado) {
      case 'impago':        
        return resultado.filter(x => x.idAlumnoxServicioGen != null && x.saldo > 0);
      case 'pagado':
        return resultado.filter(x => x.idAlumnoxServicioGen != null && x.saldo === 0);
      case 'todos':
        return resultado.filter(x => x.idAlumnoxServicioGen != null);
      default:
        return resultado.filter(x => x.idAlumnoxServicioGen != null);
    }
  }
    
  async opById(id: string) {
    return await this.opsModel.findById(id);
  }

  async modificarOP(id: string, updateOpDto: UpdateOpDto, sesion: mongoose.ClientSession | null = null ) {
    return (await this.opsModel.findByIdAndUpdate(id, updateOpDto, {new: true})).$session(sesion);    
  }

  remove(id: number) {
    return `This action removes a #${id} op`;
  }
}
