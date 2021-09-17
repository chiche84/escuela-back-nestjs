import { Schema } from 'mongoose';
export const AjustesxServiciosxAlumnosSchema = new Schema({    
    idAlumnoxServicio: { type: Schema.Types.ObjectId, ref: 'AlumnosxServicios'},
    idAjuste: [{ type: Schema.Types.ObjectId, ref: 'Ajustes'}],   
    estaActivo: { type: Boolean, require: true, default: true }
},
{ 
    timestamps: true,
    versionKey: false,
    collection: 'AjustesxServiciosxAlumnos'
});