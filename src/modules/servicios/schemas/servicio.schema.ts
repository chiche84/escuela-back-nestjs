import { Schema } from 'mongoose';

export const ServicioSchema = new Schema({    
    descripcion: { type: String, require: true },
    precio: { type: Number, require: true},
    tipoGeneracion: { type: String, require: true},
    estaActivo: { type: Boolean, require: true, default: true }
},
{ 
    timestamps: true,
    versionKey: false,
    collection: 'Servicios'
});