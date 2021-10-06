export interface IAjuste extends Document {
    descripcion: string;
    monto: number;
    esPorcentual: boolean;
    modoAplicacion: string;
    fechaDesdeValidez: string;
    fechaHastaValidez: string;
    idServicioAfectado: string;
    estaActivo: boolean;
}

  export enum EModosAplicacion {
      AlPagar = 'Al Pagar',
      AlGenerar = 'Al Generarse el Servicio',
      PorCantidad = 'Por Cantidad', //cant de veces que se genera el servicio
      PorFechas = 'Al Pagar y controlar fechas'
  }