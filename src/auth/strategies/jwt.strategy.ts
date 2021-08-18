import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { IJwtPayload } from '../jwt-payload.interface';
import { UnauthorizedException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { IUsuario } from '../../usuarios/interfaces/usuario.interface';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  
    constructor(   @InjectModel('Usuarios') private readonly _usuarioModel: Model<IUsuario>  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.SECRET_JWT_SEED,
    });
  }

  async validate(payload: IJwtPayload) {
    const { nombre, id } = payload;
    const user = await this._usuarioModel.findOne({ _id: id, estaActivo: true });

    if (!user) {
      throw new UnauthorizedException();
    }

    return payload;
  }
}