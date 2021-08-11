import { Schema } from "mongoose";

export const AlumnoSchema = new Schema({    
    apellido: { type: String, require: true },
    nombre: { type: String, require: true },
    fechaNacimiento: { type: String, require: true},
    dni: { type: Number, require: true, unique: false },
    fotoDniFrente: {type: String},
    fotoDniDorso: {type: String},
    domicilioCalle: { type: String },
    domicilioNro: { type: String },
    email: {type: String},
    idRefBarrio: { type: Schema.Types.ObjectId, ref: 'RefBarrios' },
    estaActivo: { type: Boolean, require: true, default: true }    
},
{
    timestamps: true,
    versionKey: false,
    collection: 'Alumnos'
});

