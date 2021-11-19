import { Schema } from 'mongoose';
export const AjusteSchema = new Schema({    
    descripcion: { type: String, require: true },
    monto: { type: Number, require: true},
    esPorcentual: { type: Boolean, require: true, Default: true},
    modoAplicacion: { type: String, require: true },
    fechaDesdeValidez: { type: Date, require: true},
    fechaHastaValidez: { type: Date, require: true},
    cantDias: { type: Number},
    cantVeces: { type: Number},
    estaActivo: { type: Boolean, require: true, default: true }
},
{ 
    timestamps: true,
    versionKey: false,
    collection: 'Ajustes'
});