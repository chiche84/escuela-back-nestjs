import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AjusteSchema } from './schemas/ajuste.schema';
import { AjustesService } from './ajustes.service';
import { AjustesController } from './ajustes.controller';

@Module({
  imports: [
    MongooseModule.forFeature([{name: 'Ajustes', schema: AjusteSchema}], 'ConexionEscuelaDeDanza' ),
  ],
  controllers: [AjustesController],
  providers: [AjustesService],
  exports: [
    AjustesService
  ]
})
export class AjustesModule {}
