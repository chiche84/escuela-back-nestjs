import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { SigninDto } from './dto/signin.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { IUsuario } from 'src/usuarios/interfaces/usuario.interface';
import { compare } from 'bcryptjs';
import { IJwtPayload } from './jwt-payload.interface';
import { validarTokenDto } from './dto/validarToken.dto';
import { CreateUsuarioDto } from '../usuarios/dto/create-usuario.dto';

@Injectable()
export class AuthService {

    constructor(private readonly _jwtService: JwtService,
                @InjectModel('Usuarios') private readonly _usuariosModel: Model<IUsuario>){
    }

    async signin(signinDto: SigninDto): Promise<any>{ //Promise<{ token: string }> {
      
      const { nombre, email, password } = signinDto;
        
        const usuario = await this._usuariosModel.findOne({ email, estaActivo: true});        
        if (!usuario) {
          throw new NotFoundException({
            ok: false,
            msj:'El correo no existe'
          });
        }
    
        const isMatch = await compare(password, usuario.password);
    
        if (!isMatch) {
          throw new UnauthorizedException({
            ok: false,
            msj:'El password es incorrecto'
          });
        }
    
        const payload: IJwtPayload = {
          id: usuario._id,
          nombre: usuario.nombre,
          //roles: user.roles.map(r => r.name as RoleType),
        };
    
        const token = await this._jwtService.sign(payload);
    
        return {
          ok: true,
          id: usuario._id,
          nombre: usuario.nombre,
          token
        };
      }

    async revalidarToken(validartoken: validarTokenDto): Promise<any> {
      const { id, nombre } = validartoken;

      const payload: IJwtPayload = {
        id,
        nombre
        //roles: user.roles.map(r => r.name as RoleType),
      };
      const token = await this._jwtService.sign(payload); 

      return {
        ok: true,
        id, 
        nombre,
        token
      };
    }

    async googleLogin(req):Promise<any> {      
      if (!req.user) {
        return 'No user from google'
      }
      else
      {
        let usuarioNuevo: CreateUsuarioDto;
        let resultado;
        const usuarioDB = await this._usuariosModel.findOne({ email: req.user.email, estaActivo: true});        
          if (! usuarioDB) {
           

            resultado = await this._usuariosModel.create({nombre: req.user.firstName + ' ' + req.user.lastName,
                                                          email: req.user.email,
                                                          password: '@@@',
                                                          rol: 'USER_ROLE',
                                                          img: req.user.picture,
                                                          google: true,
                                                          facebook: false});
        }else {
            //existe usuario           
            //usuario.password = '@@@'; //si hago esto pierde la autenticacion normal
             resultado = await this._usuariosModel.findByIdAndUpdate(usuarioDB.id, { google: true }, { new: true})
        }
  
        
        const payload: IJwtPayload = {
          id: resultado._id,
          nombre: resultado.nombre
        }
        const token  = await this._jwtService.sign(payload);
  
        return {
            ok: true,
            id: payload.id, 
            nombre: payload.nombre,
            token,
            tipo: 'GOOGLE AUTH'
            //menu: getMenuFrontEnd(usuarioNuevo.role)
        };
      }
      
      // return {
      //   message: 'User Info from Google',
      //   user: req.user
      // }
    }

    async googleLoginAngularx(req):Promise<any> {      
      if (!req) {
        return 'No user from google'
      }
      else
      {        
        let resultado;
        const usuarioDB = await this._usuariosModel.findOne({ email: req.email, estaActivo: true});        
          if (! usuarioDB) {       
            resultado = await this._usuariosModel.create({nombre: req.firstName + ' ' + req.lastName,
                                                          email: req.email,
                                                          password: '@@@',
                                                          rol: 'USER_ROLE',
                                                          img: req.photoUrl,
                                                          google: true,
                                                          facebook: false});
        }else {
            //existe usuario           
            //usuario.password = '@@@'; //si hago esto pierde la autenticacion normal
             resultado = await this._usuariosModel.findByIdAndUpdate(usuarioDB.id, { google: true }, { new: true})
        }
  
        
        const payload: IJwtPayload = {
          id: resultado._id,
          nombre: resultado.nombre
        }
        const token  = await this._jwtService.sign(payload);
  
        return {
            ok: true,
            id: payload.id, 
            nombre: payload.nombre,
            token,
            tipo: 'GOOGLE AUTH'
            //menu: getMenuFrontEnd(usuarioNuevo.role)
        };
      }
      
      // return {
      //   message: 'User Info from Google',
      //   user: req.user
      // }
    }

}
