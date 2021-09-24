import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Cron, CronExpression } from '@nestjs/schedule';
import { Model } from 'mongoose';
import { tap } from 'rxjs';
import { IAjustexServicioxAlumno } from './ajuestesxserviciosxalumnos/interfaces/ajustexservicioxalumno.interface';
import { IServicio } from './servicios/interfaces/servicio.interface';
import { ServiciosService } from './servicios/servicios.service';
import { AjustesxserviciosxalumnosService } from './ajuestesxserviciosxalumnos/ajustesxserviciosxalumnos.service';

@Injectable()
export class TareasService {
constructor(private readonly servicioServicio: ServiciosService,
            private readonly ajustesxserviciosxalumnosServicio: AjustesxserviciosxalumnosService){

}
    //@Cron(CronExpression.EVERY_1ST_DAY_OF_MONTH_AT_NOON)
    @Cron(CronExpression.EVERY_30_SECONDS)
    async generarOP() {
        //RECORRER AjustesxServiciosxAlumnos
        //encuentro un registro, me fijo el servicio, me fijo q ajustes lo afectan...
        //FILTRAR Ajustes que tienen validez en el dia actual a generar
        //fijarse en servicios
        //TipoGeneracion: diario (todos los dias), mensual (se genera el primero de cada mes), anual (uno por año, fecha a definir) u ocasional (se genera en una fecha determinada)
        //fijarse en ajustes
        //ModoAplicacion: 
        // *Cada vez que se paga ese servicio, 
        //*cada vez que se paga ese servicio y se controla la condicion de las fechas
        //*Cantidad de veces que se aplica (1 vez o cada vez que se paga)
        //*Cuando se genera ese servicio o no
        
        const observProceso$ = this.ajustesxserviciosxalumnosServicio.listarAjustesxServxAlumnos().pipe(
            tap(resp=> {
                resp.forEach((element: any) => {
                    let servicio = this.servicioServicio.servicioById(element.idAlumnoxServicio.idServicio).pipe(
                        tap(resp=> {
                            console.log(resp);
                            if (element.idAjuste.length > 0) {
                                element.idAjuste.forEach((ajuste: any) => {
                                    console.log(element.idAlumnoxServicio + '- Ajusteee:' + ajuste.modoAplicacion);
                                });
                            }
                        })
                    );
                    servicio.subscribe();                    
                })
            })
        );

        observProceso$.subscribe();
    
    }
}