import { Schema } from 'mongoose';

export const UsuarioSchema = new Schema({    
    nombre: { type: String, require: true },
    email: { type: String, require: true },
    password: { type: String, require: true },
    rol: { type: String, require: true, default: 'USER_ROLE' },
    google: { type: Boolean, default: false },
    facebook: { type: Boolean, default: false },
    img: { type: String, default: ''},
    estaActivo: { type: Boolean, require: true, default: true }
},
{ 
    timestamps: true,
    versionKey: false,
    collection: 'Usuarios'
});