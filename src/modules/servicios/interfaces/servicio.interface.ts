export interface IServicio extends Document {   
    descripcion: string;
    precio: number;
    tipoGeneracion: string;    
}

export enum ETiposGeneracion {
    Diaria = 'Diaria',
    Mensual = 'Mensual',
    Anual = 'Anual',
    Ocasional = 'Ocasional'
}