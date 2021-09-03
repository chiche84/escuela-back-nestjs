export interface IAlumno extends Document  {    
    apellido: string;
    nombre: string;
    fechaNacimiento: string;
    dni: number;
    fotoDniFrente: string;
    fotoDniDorso: string;
    domicilioCalle: string;
    domicilioNro: string;
    email: string;
    idRefBarrio: string;    
    estaActivo: boolean;
}