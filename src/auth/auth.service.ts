import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { SigninDto } from './dto/signin.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { IUsuario } from 'src/usuarios/interfaces/usuario.interface';
import { compare } from 'bcryptjs';
import { IJwtPayload } from './jwt-payload.interface';

@Injectable()
export class AuthService {

    constructor(private readonly _jwtService: JwtService,
                @InjectModel('Usuarios') private readonly _usuariosModel: Model<IUsuario>){
    }

    async signin(signinDto: SigninDto): Promise<{ token: string }> {
        const { nombre, email, password } = signinDto;
    
        // const user: User = await this._authRepository.findOne({
        //   where: { username },
        // });
    
        const usuario = await this._usuariosModel.findOne({ email, estaActivo: true});        
        if (!usuario) {
          throw new NotFoundException('user does not exist');
        }
    
        const isMatch = await compare(password, usuario.password);
    
        if (!isMatch) {
          throw new UnauthorizedException('invalid credentials');
        }
    
        const payload: IJwtPayload = {
          id: usuario._id,
          nombre: usuario.nombre,
          //roles: user.roles.map(r => r.name as RoleType),
        };
    
        const token = await this._jwtService.sign(payload);
    
        return { token };
      }
}
