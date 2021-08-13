import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { concat, concatMap, filter, from, map, mapTo, Observable, of, switchMap, take, takeUntil, tap } from 'rxjs';
import { CreateRefBarrioDto } from './dto/create-ref-barrio.dto';
import { IRefBarrio } from './interfaces/ref-barrio.interface';
import { IAlumno } from '../alumnos/interfaces/alumno.interface';
import { MATCHES } from 'class-validator';
import { AbstractHttpAdapter } from '@nestjs/core';

@Injectable()
export class RefBarriosService {
  constructor( @InjectModel('RefBarrios') private readonly refBarrioModel: Model<IRefBarrio>,
              @InjectModel('Alumnos') private readonly alumnoModel: Model<IAlumno>){
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

  actualizarBarrio(id: string, updateRefBarrioDto: CreateRefBarrioDto): Observable<IRefBarrio>{
   return from(this.refBarrioModel.findByIdAndUpdate(id, updateRefBarrioDto, {new: true}));
  }

  
  // async eliminarBarrio(id: string) {
  //   let barrio =  await this.refBarrioModel.findById(id);
  //   if (! barrio) {
  //     return null;
  //   }

  //   // const alumnos = await AlumnoModel.find({ idRefBarrio: id }, 'apellido nombre'); 
  //   //     if (alumnos.length > 0) {
  //   //         return res.status(400).json({
  //   //             ok: true,
  //   //             msj: "Hay alumnos que tienen ese barrio, no se puede eliminar",
  //   //             barrio: alumnos
  //   //         });
  //   //     }
  //   barrio.estaActivo = false;
  //   barrio = await this.refBarrioModel.findByIdAndUpdate(id, barrio, {new: true});
  //   return barrio;
  // }
  eliminarBarrio(id: string){
    //este ejemplo lograr desencadenar el 2do observable pero no logro condicionar su ejecucion, nose como
    return  from(this.alumnoModel.findOne({ idRefBarrio: id }, "apellido nombre"))
      .pipe(
        tap(resp=> {
            //  if (resp){               
            //    console.log("barrio con alumnos");
                return resp;
            //  }
        }),        
        switchMap((barrio)=>                  
                from(this.refBarrioModel.findByIdAndUpdate(id, {estaActivo: false}, {new: true}))
                  .pipe(
                    // map((match) => {   
                    //   if (barrio) {
                    //     console.log("NO SE PUEDE ELIMINAR EL BARRIO");
                    //     match.estaActivo = true;
                    //     console.log(barrio); 
                    //     //throw Error;
                    //   }
                    //   else {
                    //     console.log('se puede eliminar el barrio');
                    //   }
                    //   console.log("match",match);                    
                    //   return match;
                    // }),
                    tap( hola=> {
                      if (barrio) {
                        console.log("NO SE PUEDE ELIMINAR EL BARRIO");
                        hola.estaActivo = true;
                        console.log(barrio); 
                        //throw Error;
                      }
                      else {
                        console.log('se puede eliminar el barrio');
                      }
                      console.log("match",hola); 
                    }

                    )

                  ) 
        )
    );

    
     
  }

  eliminarche(id: string): Observable<any>{
    return from(this.refBarrioModel.findByIdAndUpdate(id, {estaActivo: false}, {new: true}));
  }
  //from(this.refBarrioModel.findByIdAndUpdate(id, {estaActivo: false}, {new: true}))

  buscarBarrioAlumno(id: string):Observable<IAlumno>{
    return from(this.alumnoModel.findOne({ idRefBarrio: id }, "apellido nombre"));
  }
}
