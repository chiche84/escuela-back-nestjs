import { Module } from '@nestjs/common';
import { AjustesService } from './ajustes.service';
import { AjustesController } from './ajustes.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { AjusteSchema } from './schemas/ajuste.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{name: 'Ajustes', schema: AjusteSchema}], 'ConexionEscuelaDeDanza' ),
  ],
  controllers: [AjustesController],
  providers: [AjustesService],
  exports: [
    MongooseModule.forFeature([{name: 'Ajustes', schema: AjusteSchema}], 'ConexionEscuelaDeDanza')
  ]
})
export class AjustesModule {}
