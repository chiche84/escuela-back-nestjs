import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { CreateAjusteDto } from './dto/create-ajuste.dto';
import { IAjuste } from './interfaces/ajuste.interface';
import { Model } from 'mongoose';

@Injectable()
export class AjustesService {
  constructor(@InjectModel('Ajustes') private readonly ajustesModel: Model<IAjuste>){

  }

  async crearAjuste(createAjusteDto: CreateAjusteDto): Promise<IAjuste> {
    return await this.ajustesModel.create(createAjusteDto);
  }

  async verAjustes(): Promise<IAjuste[]> {
    return await this.ajustesModel.find({ estaActivo: true});
  }

  async ajusteById(id: string): Promise<IAjuste> {
    return await this.ajustesModel.findById(id);
  }

  async modificarAjuste(id: string, updateAjusteDto: CreateAjusteDto): Promise<IAjuste> {
    return await this.ajustesModel.findByIdAndUpdate(id, updateAjusteDto, {new: true});
  }

  async eliminarAjuste(id: string): Promise<any> {
    //TODO: controlo dependencias antes de eliminar:
    //ajustesxservicioxalumno
    return await this.ajustesModel.findByIdAndUpdate(id, { estaActivo: false }, {new: true});
  }
}
