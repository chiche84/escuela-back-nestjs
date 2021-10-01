import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { tap, map, from, Observable, switchMap, filter } from 'rxjs';
import { IAjustexServicioxAlumno } from './ajuestesxserviciosxalumnos/interfaces/ajustexservicioxalumno.interface';
import { IServicio, ETiposGeneracion } from './servicios/interfaces/servicio.interface';
import { ServiciosService } from './servicios/servicios.service';
import { AjustesxserviciosxalumnosService } from './ajuestesxserviciosxalumnos/ajustesxserviciosxalumnos.service';
import { OpService } from './op/op.service';

@Injectable()
export class TareasService {
constructor(private readonly servicioServicio: ServiciosService,
            private readonly ajustesxserviciosxalumnosServicio: AjustesxserviciosxalumnosService,
            private readonly opServicio: OpService){

}
    //@Cron(CronExpression.EVERY_1ST_DAY_OF_MONTH_AT_NOON)
    //@Cron(CronExpression.EVERY_30_SECONDS)
     async generarOP() {
        //RECORRER AjustesxServiciosxAlumnos
        //encuentro un registro, me fijo el servicio, me fijo q ajustes lo afectan...
        //FILTRAR Ajustes que tienen validez en el dia actual a generar LISTO 
        //fijarse en servicios
        //TipoGeneracion: diario (todos los dias), mensual (se genera el primero de cada mes), anual (uno por año, fecha a definir) u ocasional (se genera en una fecha determinada)
        //fijarse en ajustes
        //ModoAplicacion: 
        // *Cada vez que se paga ese servicio, 
        //*cada vez que se paga ese servicio y se controla la condicion de las fechas
        //*Cantidad de veces que se aplica (1 vez o cada vez que se paga)
        //*Cuando se genera ese servicio o no
        
        let total = 0;
        let totalInterno = 0;
        let servGenerados = 0;
        const fechaActual: Date =  new Date(Date.now());
        let arrayAjustes: string[] = [];

        //**CON PROMESAS.. FUNCIONA SECUENCIAL... FALTA PROBAR CON LA VALIDACION QUE NO SE HAYA GENERADO EN EL MES ACTUAL (que tambien es asyncrona) */
        const listaTotal = await this.ajustesxserviciosxalumnosServicio.listarAjustesxServxAlumnosByFechaPromise(fechaActual);
        for (let index = 0; index < listaTotal.length; index++) {
            const element = listaTotal[index] as any;
                total++;
                arrayAjustes = [];
                if (element.idAjustes.length > 0) {                    
                    console.log('promesa '+total +'--> ', element);
                    totalInterno = 0;
                    for (let index = 0; index < element.idAjustes.length; index++) {
                        const elementAjuste = element.idAjustes[index];
                        
                        arrayAjustes.push(elementAjuste._id)
                        totalInterno++;
                        switch ( element.idAlumnoxServicio.idServicio.tipoGeneracion) {
                            case ETiposGeneracion.Mensual:
                                //TODO:Controlo que no se haya generado en el mes actual

                                servGenerados = (await this.opServicio.buscarPorAlumnoxServicioMes(element.idAlumnoxServicio._id, fechaActual)).length;
                                console.log('SERVICIOS GENERADOS- iteracion '+ total + ' -aju ' + totalInterno + ' -sg '+ servGenerados);
                                if (servGenerados === 0)
                                {

                                    await this.opServicio.crearOp({   descripcion: 'iteracion prom ' + total, 
                                                                                    monto: element.idAlumnoxServicio.idServicio.precio, 
                                                                                    saldo: element.idAlumnoxServicio.idServicio.precio, 
                                                                                    fechaGeneracion: fechaActual,
                                                                                    idAlumnoxServicioGen: element.idAlumnoxServicio._id,
                                                                                    idAjustesAplicados: arrayAjustes })
                                    console.log('Guardada OP iteracion iteracion '+ total + ' -aju' + totalInterno);
                                }

                                
                                break;
                            case ETiposGeneracion.Diaria:
                                break;
                        }
                    }

                }
                else{
                    console.info('no tiene ajustes');
                }   
        }
        
        // .then(  x=> x.forEach((value:any)=> {
        //         total++;
        //         arrayAjustes = [];
        //         if (value.idAjustes.length > 0) {                    
        //             console.log('promesa '+total +'--> ', value);

        //             value.idAjustes.forEach((a:any)=>  arrayAjustes.push(a._id));
        //             totalInterno++;
        //             switch ( value.idAlumnoxServicio.idServicio.tipoGeneracion) {
        //                 case ETiposGeneracion.Mensual:
        //                     //TODO:Controlo que no se haya generado en el mes actual
                            
        //                     this.opServicio.crearOp({   descripcion: 'iteracion prom ' + total, 
        //                                                 monto: value.idAlumnoxServicio.idServicio.precio, 
        //                                                 saldo: value.idAlumnoxServicio.idServicio.precio, 
        //                                                 fechaGeneracion: fechaActual,
        //                                                 idAlumnoxServicioGen: value.idAlumnoxServicio._id,
        //                                                 idAjustesAplicados: arrayAjustes })
                            
        //                     break;
        //                 case ETiposGeneracion.Diaria:
        //                     break;
        //             }
        //         }
        //         else{
        //             console.info('no tiene ajustes');
        //         }
        //     })
        // );
                

        // const observProceso$ = this.ajustesxserviciosxalumnosServicio.listarAjustesxServxAlumnosByFecha(fechaActual).pipe(
        //         map(resp => from(resp).forEach((value:VistaServiciosAjustes) => {
        //                 total++;
        //                 arrayAjustes = [];
        //                 if (value.idAjustes.length > 0 && value.idAlumnoxServicio.idAlumno != null && value.idAlumnoxServicio.idServicio != null) {                    
        //                         console.log('observable '+total +'--> ', value);
                    
        //                         value.idAjustes.forEach(a=>  arrayAjustes.push(a._id));
                    
        //                         switch ( value.idAlumnoxServicio.idServicio.tipoGeneracion) {
        //                                 case ETiposGeneracion.Mensual:
        //                                     //Controlo que no se haya generado en el mes actual
        //                                     // this.opServicio.buscarPorServicioAlumnoMes(value.idAlumnoxServicio.idAlumno._id, value.idAlumnoxServicio.idServicio._id, fechaActual)
        //                                     //                 .then(x=> servGenerados = x.length)
        //                                     //                 .catch(x=> {
        //                                     //                     console.log('---------FALLO EN ' +x);
        //                                     //                     servGenerados = 69;
        //                                     //                 });
        //                                     //  this.opServicio.buscarPorAlumnoxServicioMes(value.idAlumnoxServicio._id, fechaActual)                                                
        //                                     //                                     .then(x=> {servGenerados = x;
        //                                     //                                             console.log('SERVICIOS GENERADOS, iteracion:' + total + ' -- ' + x);
        //                                     //                                         })
        //                                     //                                     .catch(x=> {
        //                                     //                                         console.log('---------FALLO EN ' +x);
        //                                     //                                         servGenerados = 69;
        //                                     //                                     });
        //                                     if (servGenerados === 0) {
        //                                         this.opServicio.crearOPObser({   descripcion: 'iteracion obs ' + total, 
        //                                                                     monto: value.idAlumnoxServicio.idServicio.precio, 
        //                                                                     saldo: value.idAlumnoxServicio.idServicio.precio, 
        //                                                                     fechaGeneracion: fechaActual,
        //                                                                     idAlumnoxServicioGen: value.idAlumnoxServicio._id,
        //                                                                     idAjustesAplicados: arrayAjustes }).subscribe() //funciona tambien si uso la promesa                                                
        //                                     }
                        
        //                                     break;
        //                                 case ETiposGeneracion.Diaria:
        //                                     break;
        //                             }
        //                 }
        //                 else{
        //                         console.info('no tiene ajustes, servicio o alumno');
        //                     }
        //             }))
        //         );                            
                            
        //         observProceso$.subscribe();
                            
                //return this.ajustesxserviciosxalumnosServicio.listarAjustesxServxAlumnosByFecha(fechaActual);                            
            }
        }
                    
export interface VistaServiciosAjustes {
    idAjustes?:         IDAjuste[];
    estaActivo?:        string;
    _id?:               string;
    idAlumnoxServicio?: IDAlumnoxServicio;
    createdAt?:         Date;
    updatedAt?:         Date;
}

export interface IDAjuste {
    _id?:               string;
    descripcion?:       string;
    fechaDesdeValidez?: Date;
    fechaHastaValidez?: Date;
}

export interface IDAlumnoxServicio {
    estaActivo?: string;
    _id?:        string;
    idAlumno?:   IDAlumno;
    idServicio?: IDServicio;
    createdAt?:  Date;
    updatedAt?:  Date;
}

export interface IDAlumno {
    _id?:             string;
    nombre?:          string;
    fechaNacimiento?: Date;
}

export interface IDServicio {
    _id?:            string;
    tipoGeneracion?: string;
    precio?: number;
}
