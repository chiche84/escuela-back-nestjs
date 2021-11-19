export interface IAjuste extends Document {
    _id?: string;
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
      AlPagarCantDias = 'Al pagar (cantidad dias)',
      AlGenerar = 'Al Generarse el Servicio',
      AlPagarCantVeces = 'Al pagar (cantidad veces)', 
      MesVencido = 'Mes vencido'
  }
