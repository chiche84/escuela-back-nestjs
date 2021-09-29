export class CreateOpDto {
    readonly descripcion: string;
    readonly monto: number;
    readonly fechaGeneracion: Date;
    readonly saldo: number;
    readonly idAlumnoxServicioGen: string;
    readonly idAjustesAplicados: string[];
}
