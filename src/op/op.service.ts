import { Injectable } from '@nestjs/common';
import { CreateOpDto } from './dto/create-op.dto';
import { UpdateOpDto } from './dto/update-op.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Iop } from './interfaces/op.interface';

@Injectable()
export class OpService {

  constructor(@InjectModel('Ops') private readonly opsModel: Model<Iop>){}

  async crearOp(createOpDto: CreateOpDto) {
    return await this.opsModel.create(createOpDto);
  }

  findAll() {
    return `This action returns all op`;
  }

  findOne(id: number) {
    return `This action returns a #${id} op`;
  }

  update(id: number, updateOpDto: UpdateOpDto) {
    return `This action updates a #${id} op`;
  }

  remove(id: number) {
    return `This action removes a #${id} op`;
  }
}
