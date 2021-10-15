import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { CreatePagoDto } from './dto/create-pago.dto';
import { UpdatePagoDto } from './dto/update-pago.dto';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Ipago } from './interfaces/pago.interface';

@Injectable()
export class PagosService {

  constructor( @InjectModel('Pagos') private readonly pagosModel: Model<Ipago>){}

  async create(createPagoDto: CreatePagoDto) {          
      return await this.pagosModel.create(createPagoDto);
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
