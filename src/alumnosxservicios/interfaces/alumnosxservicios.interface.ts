export interface IAlumnoxServicio extends Document  {    
    idAlumno: string;
    idServicio: string;
    idAjustes: string[];
    estaActivo: boolean;
}