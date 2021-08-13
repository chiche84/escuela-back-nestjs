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