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
    //const sesion = await this.conexionDanza.startSession();
    try {
      //sesion.startTransaction();
      pago =  await this.pagosModel.create({ 
        idOpPagada: createPagoDto.idOpPagada, 
        monto: createPagoDto.monto, 
        fechaPago: createPagoDto.fechaPago, 
        idUsuario: createPagoDto.idUsuario,
        //session: sesion
        });
        
      if (! pago) {
        throw new UnprocessableEntityException();
      }
      //POST CONDICION: restar saldo de la OP    
      const opModificada = await this.opService.opById(pago.idOpPagada);
      const saldoRestante = opModificada.monto - pago.monto;  
      const objModif: UpdateOpDto = { saldo: saldoRestante };
      const actualizarOP = await this.opService.modificarOP(pago.idOpPagada, objModif);
      if (actualizarOP) {
        console.log("entro al commit");
        //await sesion.commitTransaction();
      }
      
    } catch (error) {
      console.log("fue pal error");
      //await sesion.abortTransaction();
      pago = null;
    } 
    //sesion.endSession();    
    return pago;
  }

  async crearmuchos( createPagoDto: CreatePagoDto[]){
    let pagos: Ipago[];
    for (let index = 0; index < createPagoDto.length; index++) {
      const element = createPagoDto[index];
      console.log(element);
      let pagoNuevo = await this.create(element)
      pagos.push(pagoNuevo);  
    }
    return pagos;
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
