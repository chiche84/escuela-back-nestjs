import { IsDate, IsDateString, IsMongoId, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreatePagoDto {   
    @IsMongoId()
    readonly idOpPagada: string;
    @IsNumber()
    readonly monto: number;
    @IsDateString()
    readonly fechaPago: Date;
    @IsMongoId()
    readonly idUsuario: string;
}
