export interface IUsuario extends Document{
    nombre: string,
    email: string,
    password: string,
    rol: string,
    google: boolean,
    facebook: boolean,
    estaActivo: boolean
}