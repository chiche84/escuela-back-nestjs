import { Schema } from 'mongoose';
export const AjusteSchema = new Schema({    
    descripcion: { type: String, require: true },
    monto: { type: Number, require: true},
    esPorcentual: { type: Boolean, require: true, Default: true},
    modoAplicacion: { type: String, require: true },
    fechaDesdeValidez: { type: String, require: true},
    fechaHastaValidez: { type: String, require: true},
    idServicioAfectado: { type: Schema.Types.ObjectId, ref: 'Servicios'},
    estaActivo: { type: Boolean, require: true, default: true }
},
{ 
    timestamps: true,
    versionKey: false,
    collection: 'Ajustes'
});