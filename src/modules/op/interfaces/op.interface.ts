
export interface Iop extends Document  {
    descripcion: string;
    monto: number;
    fechaGeneracion: Date;
    saldo: number;
    idAlumnoxServicioGen: string;
    idAjustesAplicados: string[];
    estaActivo: boolean;   
}