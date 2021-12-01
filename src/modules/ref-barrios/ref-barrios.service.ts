import { RefBarrios1 } from './entities/ref-barrios.entity';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { from, map, Observable} from 'rxjs';
import { CreateRefBarrioDto } from './dto/create-ref-barrio.dto';
import { IRefBarrio } from './interfaces/ref-barrio.interface';
import { IAlumno } from '../alumnos/interfaces/alumno.interface';
import { AlumnosService } from '../alumnos/alumnos.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';


@Injectable()
export class RefBarriosService {
  constructor( @InjectModel('RefBarrios') private readonly refBarrioModel: Model<IRefBarrio>,
              private readonly alumnoServicio: AlumnosService,
              @InjectRepository(RefBarrios1)  private barriosRepository: Repository<RefBarrios1>){
  }
  

  // async crearBarrio(createRefBarrioDto: CreateRefBarrioDto): Promise<IRefBarrio> {            
  //     const barrio = await  this.refBarrioModel.create(createRefBarrioDto);
  //     return barrio.save(); 
  // }

  crearBarrio(createRefBarrioDto: CreateRefBarrioDto): Observable<IRefBarrio> { 
    return from(this.refBarrioModel.create(createRefBarrioDto)); 
  }

  // async verBarrios(): Promise<IRefBarrio[]> {
  //   const barrios = await this.refBarrioModel.find({ estaActivo: true });
  //   return barrios;
  // }
async verBarrios1(): Promise<RefBarrios1[]>{
    const resul = await this.barriosRepository.find({});
    console.log(resul);
    return resul;
}
  verBarrios(): Observable<IRefBarrio[]> {
    return from(this.refBarrioModel.find({ estaActivo: true }))
            .pipe(
             map( resp=> resp as IRefBarrio[])
            );
    
  }

  // async barrioById(id: string):Promise<IRefBarrio> {
  //   const barrio = await this.refBarrioModel.findById(id);
  //   return barrio;
  // }

  barrioById(id: string):Observable<IRefBarrio> {
    return from(this.refBarrioModel.findById(id));    
  }

  // async actualizarBarrio(id: string, updateRefBarrioDto: CreateRefBarrioDto): Promise<IRefBarrio>{
  //   let barrio =  await this.refBarrioModel.findById(id);
  //   if (! barrio) {
  //     return null;
  //   }
  //   barrio = await this.refBarrioModel.findByIdAndUpdate(id, updateRefBarrioDto, {new: true});
  //   return barrio;
  // }

  modificarBarrio(id: string, updateRefBarrioDto: CreateRefBarrioDto): Observable<IRefBarrio>{
   return from(this.refBarrioModel.findByIdAndUpdate(id, updateRefBarrioDto, {new: true}));
  }

  
  async eliminarBarrio(id: string): Promise<any> {
  
    //controlo dependencias antes de eliminar
    //const alumnos = await this.alumnoModel.find({ idRefBarrio: id, estaActivo: true }, 'apellido nombre email'); 
      const alumnos = await this.alumnoServicio.alumnosByIdBarrio(id);
      if (alumnos.length > 0) {
          return {
              ok: false,
              msj: "Hay alumnos que tienen ese Barrio, no se puede eliminar",
              alumnos
          };
      }
    const barrioEliminado = await this.refBarrioModel.findByIdAndUpdate(id, { estaActivo: false }, {new: true});
    if (barrioEliminado) {      
      return {
        ok: true,
        msj: "Barrio Eliminado",
        barrioEliminado
      }; 
    }

    return null;
  }

  // eliminarBarrio(id: string): Observable<IRefBarrio>{
  //   //este ejemplo lograr desencadenar el 2do observable pero no logro condicionar su ejecucion, nose como :(... mas adelante lo sabre
  //   return  from(this.alumnoModel.findOne({ idRefBarrio: id }, "apellido nombre"))
  //     .pipe(
  //       tap(resp=> {
  //             if (resp){               
  //               console.log("barrio con alumnos");
  //               return resp;
  //             }
  //       }),        
  //       switchMap((barrio)=>                  
  //               from(this.refBarrioModel.findByIdAndUpdate(id, {estaActivo: false}, {new: true}))
  //                 .pipe(
  //                   map((match) => {   
  //                     if (barrio) {
  //                       console.log("NO SE PUEDE ELIMINAR EL BARRIO");
  //                       match.estaActivo = true;
  //                       console.log(barrio); 
  //                       //throw Error;
  //                     }
  //                     else {
  //                       console.log('se puede eliminar el barrio');
  //                     }
  //                     console.log("match",match);                    
  //                     return match;
  //                   })         
  //                 ) 
  //       )
  //   );
  // }

}
