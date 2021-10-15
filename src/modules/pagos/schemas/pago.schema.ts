import { Schema } from "mongoose";

export const PagoSchema = new Schema({    
    idOpPagada: { type: Schema.Types.ObjectId,  ref: 'Ops', require: true},
    monto: { type: Number, require: true},
    fechaPago: { type: Date, require: true},
    idUsuario: { type: Schema.Types.ObjectId,  ref: 'Usuarios', require: true},
    estaActivo: { type: Boolean, require: true, default: true }    
},
{
    timestamps: true,
    versionKey: false,
    collection: 'Pagos'
});