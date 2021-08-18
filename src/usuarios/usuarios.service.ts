import { Injectable } from '@nestjs/common';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import { Model } from 'mongoose';
import { IUsuario } from './interfaces/usuario.interface';
import { genSaltSync, hashSync } from 'bcryptjs';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class UsuariosService {
  constructor(@InjectModel('Usuarios') private readonly _usuarioModel: Model<IUsuario>){

  }

  async crearUsuario(createUsuarioDto: CreateUsuarioDto): Promise<any> {

    const usuario = await this._usuarioModel.findOne({ email: createUsuarioDto.email, estaActivo: true });

    if ( usuario ) {
        return null;
    }        
    // Hashear la contraseña
    const salt = genSaltSync()
    createUsuarioDto.password = hashSync( createUsuarioDto.password, salt );   
    
    return  await this._usuarioModel.create(createUsuarioDto);
  }

  findAll() {
    return `This action returns all usuarios`;
  }

  findOne(id: number) {
    return `This action returns a #${id} usuario`;
  }

  update(id: number, updateUsuarioDto: UpdateUsuarioDto) {
    return `This action updates a #${id} usuario`;
  }

  remove(id: number) {
    return `This action removes a #${id} usuario`;
  }
}
