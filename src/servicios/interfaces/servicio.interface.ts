export interface IServicio extends Document {   
    descripcion: string;
    precio: number;
    tipoGeneracion: string;    
}

export enum ETiposGeneracion {
    D = 'Diaria',
    M = 'Mensual',
    A = 'Anual',
    O = 'Ocasional'
}