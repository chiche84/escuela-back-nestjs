import { Document } from "mongoose";

export interface Ipago extends Document{
    idOpPagada: string;
    monto: number;
    fechaPago: Date;
    idUsuario: string;
    estaActivo: boolean;
}