import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { tap, map, from, Observable } from 'rxjs';
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
        const fechaActual: Date =  new Date(Date.now());
        let arrayAjustes: string[] = [];
        const observProceso$ = this.ajustesxserviciosxalumnosServicio.listarAjustesxServxAlumnosByFecha(fechaActual).pipe(
            map(resp => from(resp).forEach((value:VistaServiciosAjustes) => {
                total++;
                arrayAjustes = [];
                if (value.idAjustes.length > 0) {                    
                    console.log('observable '+total +'--> ', value);

                    value.idAjustes.forEach(a=>  arrayAjustes.push(a._id));

                    switch ( value.idAlumnoxServicio.idServicio.tipoGeneracion) {
                        case ETiposGeneracion.Mensual:
                            //TODO:Controlo que no se haya generado en el mes actual
                            
                            this.opServicio.crearOp({   descripcion: 'iteracion ' + total, 
                                                        monto: value.idAlumnoxServicio.idServicio.precio, 
                                                        saldo: value.idAlumnoxServicio.idServicio.precio, 
                                                        fechaGeneracion: fechaActual,
                                                        idAlumnoxServicioGen: value.idAlumnoxServicio._id,
                                                        idAjustesAplicados: arrayAjustes })
                            
                            break;
                        case ETiposGeneracion.Diaria:
                            break;
                    }
                }
                else{
                    console.info('no tiene ajustes');
                }
            }))
        )
        observProceso$.subscribe();
        
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
