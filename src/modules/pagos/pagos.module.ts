import { Module } from '@nestjs/common';
import { PagosService } from './pagos.service';
import { PagosController } from './pagos.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { PagoSchema } from './schemas/pago.schema';

@Module({
  imports: [ 
    MongooseModule.forFeature([{ name: 'Pagos', schema: PagoSchema }], 'ConexionEscuelaDeDanza' )
  ],
  controllers: [PagosController],
  providers: [PagosService]
})
export class PagosModule {}
