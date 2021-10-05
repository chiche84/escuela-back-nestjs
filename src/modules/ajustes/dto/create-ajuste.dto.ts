export class CreateAjusteDto {
    readonly descripcion: string;
    readonly monto: number;
    readonly esPorcentual: boolean;
    readonly modoAplicacion: string;
    readonly fechaDesdeValidez: string;
    readonly fechaHastaValidez: string;
    readonly idServicioAfectado: string;
    readonly estaActivo: boolean;
}
