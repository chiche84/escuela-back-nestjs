import { Schema } from "mongoose";

export const RefBarrioSchema = new Schema({    
    nombreBarrio: { type: String, require: true },
    estaActivo: { type: Boolean, require: true, default: true }    
},
{
    timestamps: true,
    versionKey: false,
    collection: 'RefBarrios'
});