import { Schema } from "mongoose";

export const OpSchema = new Schema({    
    descripcion: { type: String, require: true },
    monto: { type: Number, require: true},
    fechaGeneracion: { type: Date, require: true},
    saldo: { type: Number, require: true},
    idAlumnoxServicioGen: { type: Schema.Types.ObjectId, require: true},
    idAjustesAplicados: [{ type: Schema.Types.ObjectId, require: true}],
    estaActivo: { type: Boolean, require: true, default: true }    
},
{
    timestamps: true,
    versionKey: false,
    collection: 'Ops'
});