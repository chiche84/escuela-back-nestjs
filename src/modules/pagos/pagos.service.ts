import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { CreatePagoDto } from './dto/create-pago.dto';
import { UpdatePagoDto } from './dto/update-pago.dto';
import { Model, Connection, createConnection } from 'mongoose';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Ipago } from './interfaces/pago.interface';
import { OpService } from '../op/op.service';
import { UpdateOpDto } from '../op/dto/update-op.dto';

@Injectable()
export class PagosService {

  constructor( @InjectModel('Pagos') private readonly pagosModel: Model<Ipago>,
                @InjectConnection('ConexionEscuelaDeDanza') private conexionDanza: Connection,
                private readonly opService: OpService){}

  async create(createPagoDto: CreatePagoDto) { 
    let pago: Ipago;
    const conexionSesion = await this.conexionDanza.startSession();
   
    try {
      conexionSesion.startTransaction();
      
      await this.conexionDanza.transaction(async (sesion) => {
        pago =  await this.pagosModel.create({ 
          idOpPagada: createPagoDto.idOpPagada, 
          monto: createPagoDto.monto, 
          fechaPago: createPagoDto.fechaPago, 
          idUsuario: createPagoDto.idUsuario,
          session: sesion
          });
          if (! pago) {
            throw new UnprocessableEntityException();
          }
          //POST CONDICION: restar saldo de la OP    
          const opModificada = await this.opService.opById(pago.idOpPagada);
          const saldoRestante = opModificada.monto - pago.monto;  
          const objModif: UpdateOpDto = { saldo: saldoRestante };
          const actualizarOP = await this.opService.modificarOP(pago.idOpPagada, objModif, sesion); 
      }).then(resp=> {            
            return pago;
      }).catch(err=> {
        console.log("Error", err);        
        return null;
      })
            
    } catch (error) {
      console.log("fue pal error");
      pago = null;
    } 
    conexionSesion.endSession();    
    return pago;
  }

 


  async crearmuchos( createPagoDto: CreatePagoDto[]){
    let pagos: Ipago[];
    try {      
      pagos = await this.pagosModel.create(createPagoDto);

      for (let index = 0; index < pagos.length; index++) {
        const pago = pagos[index];
        let opModificada = await this.opService.opById(pago.idOpPagada);
        let saldoRestante = opModificada.monto - pago.monto;  
        let objModif: UpdateOpDto = { saldo: saldoRestante };
        let actualizarOP = await this.opService.modificarOP(pago.idOpPagada, objModif);
      }
    } catch (error) {
      
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
