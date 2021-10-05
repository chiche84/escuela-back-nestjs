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
      AlPagar = 'Cada vez que se paga el Servicio',
      AlGenerar = 'Cada vez que se genera el Servicio ',
      PorCantidad = 'Por cantidad de veces que se genera el Servicio',
      PorFechas = 'Cada vez que se paga el Servicio y se controla la fecha de pago'
  }