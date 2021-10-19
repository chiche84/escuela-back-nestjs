import { Module } from '@nestjs/common';
import { OpService } from './op.service';
import { OpController } from './op.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { OpSchema } from './schemas/op.schema';

@Module({
  imports: [ 
    MongooseModule.forFeature([{ name: 'Ops', schema: OpSchema }], 'ConexionEscuelaDeDanza' )
  ],
  controllers: [OpController],
  providers: [OpService],
  exports:[
    OpService
  ]
})
export class OpModule {}
