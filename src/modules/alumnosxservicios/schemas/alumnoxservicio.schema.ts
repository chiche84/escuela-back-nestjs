import { Schema } from 'mongoose';

export const AlumnosxServiciosSchema = new Schema({ 
    idAlumno: { type: Schema.Types.ObjectId, ref: 'Alumnos', require: true},
    idServicio: { type: Schema.Types.ObjectId, ref: 'Servicios',  require: true},
    idAjustes: [{ type: Schema.Types.ObjectId, ref: 'Ajustes'}],  
    estaActivo: { type: Boolean, require: true, default: true }
},
{ 
    timestamps: true,
    versionKey: false,
    collection: 'AlumnosxServicios'
});
