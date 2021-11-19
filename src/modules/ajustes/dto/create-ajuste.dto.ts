export class CreateAjusteDto {
    readonly descripcion: string;
    readonly monto: number;
    readonly esPorcentual: boolean;
    readonly modoAplicacion: string;
    readonly fechaDesdeValidez: string;
    readonly fechaHastaValidez: string;
    readonly cantDias: number;
    readonly cantVeces: number;
    readonly estaActivo: boolean;
}
