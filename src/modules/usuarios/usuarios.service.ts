import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { genSaltSync, hashSync } from 'bcryptjs';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import { IUsuario } from './interfaces/usuario.interface';

@Injectable()
export class UsuariosService {
  public VALORUSUARIO: string;
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
