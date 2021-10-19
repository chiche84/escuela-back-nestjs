import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { CreatePagoDto } from './dto/create-pago.dto';
import { UpdatePagoDto } from './dto/update-pago.dto';
import { Model } from 'mongoose';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Ipago } from './interfaces/pago.interface';
import * as mongoose from 'mongoose';
import { OpService } from '../op/op.service';
import { UpdateOpDto } from '../op/dto/update-op.dto';

@Injectable()
export class PagosService {

  constructor( @InjectModel('Pagos') private readonly pagosModel: Model<Ipago>,
                @InjectConnection('ConexionEscuelaDeDanza') private readonly conexionDanza: mongoose.Connection,
                private readonly opService: OpService){}

  async create(createPagoDto: CreatePagoDto) { 
    let pago: Ipago;
    const sesion = await this.conexionDanza.startSession();
    sesion.startTransaction();
    try {
      pago =  await this.pagosModel.create(createPagoDto);
      if (! pago) {
        throw new UnprocessableEntityException();
      }
      //POST CONDICION: restar saldo de la OP    
      const opModificada = await this.opService.opById(pago.idOpPagada);
      const saldoRestante = opModificada.monto - pago.monto;  
      const objModif: UpdateOpDto = { saldo: saldoRestante };
      const actualizarOP = await this.opService.modificarOP(pago.idOpPagada, objModif);
      if (actualizarOP) {
        sesion.commitTransaction();
      }
    } catch (error) {
      await sesion.abortTransaction();
      return null;
    } finally {
      sesion.endSession();
    }

    return pago;
  }

  findAll() {
    return `This action returns all pagos`;
  }

  findOne(id: number) {
    return `This action returns a #${id} pago`;
  }

  update(id: number, updatePagoDto: UpdatePagoDto) {
    return `This action updates a #${id} pago`;
  }

  remove(id: number) {
    return `This action removes a #${id} pago`;
  }
}
