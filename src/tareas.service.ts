import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { IServicio, ETiposGeneracion } from './modules/servicios/interfaces/servicio.interface';
import { OpService } from './modules/op/op.service';
import { AlumnosxServiciosService } from './modules/alumnosxservicios/alumnosxservicios.service';
import { EModosAplicacion, IAjuste } from './modules/ajustes/interfaces/ajuste.interface';
import { CreateAlumnoDto } from './modules/alumnos/dto/create-alumno.dto';

@Injectable()
export class TareasService {
constructor(private readonly AlumnosxserviciosServicio: AlumnosxServiciosService,
            private readonly opServicio: OpService){

}
    //@Cron(CronExpression.EVERY_1ST_DAY_OF_MONTH_AT_NOON)
  
    async generarOP() {        
        let total = 0;
        let totalInterno = 0;
        let servGenerados = 0;
        const fechaActual: Date =  new Date(Date.now());
        let arrayAjustes: string[] = [];
        
        //**CON PROMESAS.. FUNCIONA SECUENCIAL... */    
        const listaAlumnosxServicios = await this.AlumnosxserviciosServicio.listarServxAlumnosByFechaAjustePromise(fechaActual);
        //recorro alumnosxservicios (cada registro puede tener uno o mas ajustes.. esto ya no es asi)
        for (let index = 0; index < listaAlumnosxServicios.length; index++) {
            const elementServicio = listaAlumnosxServicios[index] as any;
                total++;
                arrayAjustes = [];
                                
                console.log('promesa '+total +'--> ', elementServicio);
                totalInterno = 0;
                servGenerados = 0;

                if (elementServicio.idAjustes) { //SERVICIO TIENE AJUSTES, CONTROLAR SI AFECTAN AL GENERAR
                    for (let index = 0; index < elementServicio.idAjustes.length; index++) { //recorro los ajustes
                        const elementAjuste = elementServicio.idAjustes[index] as IAjuste;  
                        if (elementAjuste.modoAplicacion === EModosAplicacion.AlGenerar) { //el ajuste modifica el precio del servicio (al generarse)
                            totalInterno++;
                            switch ( elementServicio.idServicio.tipoGeneracion) {
                                case ETiposGeneracion.Mensual:                                 
                                //controlo que el servicio de ese alumno con los ajustes que se crean al generar, este generado ya:
                                servGenerados = (await this.opServicio.buscarPorAlumnoxServicioMes(elementServicio._id, fechaActual, elementAjuste._id)).length;
                                console.log('Servicios ya generados(con ajustes al gen) - iteracion '+ total + ' -aju ' + totalInterno + ' -cantServExistentes '+ servGenerados + '-ajuste:' + elementAjuste._id);
                                if (servGenerados === 0) //si no esta generado el servicio (op) lo agrego al array para insertar todo el array junto en el OP (con los ajustes que corresponden a ese servicio)
                                {      
                                    elementServicio.idServicio.precio = elementServicio.idServicio.precio + elementAjuste.monto             
                                    arrayAjustes.push(elementAjuste._id)
                                }                             
                                break;
                                case ETiposGeneracion.Anual:
                                    break;
                                case ETiposGeneracion.Diaria:    
                                case ETiposGeneracion.Ocasional:                                                                
                                break;
                            }                            
                        }
                    }
                    if (arrayAjustes.length > 0 && servGenerados === 0) {                        
                        //guardar array ajustes que se fue armando con los que tienen modo aplicacion: al generar servicio
                        await this.opServicio.crearOp({   descripcion: 'iteracion ' + total, 
                                                                        monto: elementServicio.idServicio.precio, 
                                                                        saldo: elementServicio.idServicio.precio, 
                                                                        fechaGeneracion: fechaActual,
                                                                        idAlumnoxServicioGen: elementServicio._id,
                                                                        idAjustesAplicados: arrayAjustes })
                        console.log('GUARDADA OP iteracion '+ total + ' -aju' + totalInterno);
                    }else if (servGenerados === 0){ //no tiene ajustes que se apliquen al generar (tiene ajustes pero que se aplican en otras condiciones)
                            //controlar que no este creada ya en el periodo de tiempo de la generacion
                            switch ( elementServicio.idServicio.tipoGeneracion) {
                                case ETiposGeneracion.Mensual:                                 
                                //controlo que el servicio de ese alumno (SIN AJUSTES) este generado ya:
                                servGenerados = (await this.opServicio.buscarPorAlumnoxServicioMes(elementServicio._id, fechaActual)).length;
                                console.log('Servicios ya generados (sin ajustes al gen) - iteracion '+ total + ' -aju ' + totalInterno + ' -cantServExistentes '+ servGenerados );                         
                                break;
                                case ETiposGeneracion.Anual:
                                    break;
                                case ETiposGeneracion.Diaria:                                
                                break;
                            }            
                            if (servGenerados === 0) {
                                //no tiene ajustes, debe crearse directamente con el arrayAjustes vacio y sin modificaciones del precio
                                await this.opServicio.crearOp({   descripcion: 'iteracion ' + total, 
                                                    monto: elementServicio.idServicio.precio, 
                                                    saldo: elementServicio.idServicio.precio, 
                                                    fechaGeneracion: fechaActual,
                                                    idAlumnoxServicioGen: elementServicio._id,
                                                    idAjustesAplicados: [] })
                                console.log('GUARDADA OP (sin ajustes de tipo al generar) iteracion '+ total + ' -aju' + totalInterno);                        
                            }
                    }

                }else{ //EL SERVICIO NO TIENE AJUSTES
                    //controlar que no este creada ya en el periodo de tiempo de la generacion
                    switch ( elementServicio.idServicio.tipoGeneracion) {
                        case ETiposGeneracion.Mensual:                                 
                        //controlo que el servicio de ese alumno (SIN AJUSTES) este generado ya:
                        servGenerados = (await this.opServicio.buscarPorAlumnoxServicioMes(elementServicio._id, fechaActual)).length;
                        console.log('Servicios ya generados (sin ajustes) - iteracion '+ total + ' -aju ' + totalInterno + ' -cantServExistentes '+ servGenerados );                         
                        break;
                        case ETiposGeneracion.Anual:
                            break;
                        case ETiposGeneracion.Diaria:                                
                        break;
                    }            
                    if (servGenerados === 0) {
                        //no tiene ajustes, debe crearse directamente con el arrayAjustes vacio y sin modificaciones del precio
                        await this.opServicio.crearOp({   descripcion: 'iteracion ' + total, 
                                            monto: elementServicio.idServicio.precio, 
                                            saldo: elementServicio.idServicio.precio, 
                                            fechaGeneracion: fechaActual,
                                            idAlumnoxServicioGen: elementServicio._id,
                                            idAjustesAplicados: [] })
                        console.log('GUARDADA OP (sin ajustes) iteracion '+ total + ' -aju' + totalInterno);                        
                    }
                }      
        }
                        
        //CON OBS NO FUNCIONA PORQUE NOSE COMO HACER PARA TRATAR LA RESP COMO OBS (from) y usar un await adentro (no se puede hacer eso)
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
       
        //OPCION elegida
        // Al crear una OP, ponerle los ajustes que la crean y aplican al generarse (como descuentos por ej).. 
        
        // Para el interes, revisar la tabla alumnosxservicios, fijarse que ajustes que generen interes tiene, y de ahi crear nuevos servicios
        // estos servicios van a ir actualizando su monto a medida que pasen los meses o la condicion de tiempo que tienen
        //por lo tanto en la tabla OPs habra por ej:
        // julio 1000 (con 1 ajustes  y descuento por hermano)
        // ajuste 100 (porque estamos en agosto y se le genero un ajuste de 100 buscando los ajustes en la tabla AlumnosxServicios)
}
                    
