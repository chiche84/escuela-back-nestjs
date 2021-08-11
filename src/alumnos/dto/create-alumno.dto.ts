export class CreateAlumnoDto{
    readonly apellido: string;
    readonly nombre: string;
    readonly fechaNacimiento: string;
    readonly dni: number;
    readonly fotoDniFrente: string;
    readonly fotoDniDorso: string;
    readonly domicilioCalle: string;
    readonly domicilioNro: string;
    readonly email: string;
    readonly idRefBarrio: string;    
    readonly estaActivo: boolean;
}