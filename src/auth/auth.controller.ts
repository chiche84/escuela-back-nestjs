import { Controller, UsePipes, Body, Post, ValidationPipe, Req, Get, UseGuards, Res, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SigninDto } from './dto/signin.dto';
import { validarTokenDto } from './dto/validarToken.dto';
import { JwtAuthGuard } from './jwt-auth.guard';
import { GoogleAuthGuard } from './google-auth.guard';

@Controller('auth')
export class AuthController {
    constructor(private readonly _authService: AuthService) {        
    }

    @Post('/login')
    @UsePipes(ValidationPipe)
    async signin(@Body() signinDto: SigninDto) {   
      return this._authService.signin(signinDto);
    }

    
    @Get('/renew')
    @UseGuards(JwtAuthGuard)
    async revalidarToken(@Body() validartoken: validarTokenDto) {
      return this._authService.revalidarToken(validartoken);
    }

    @Get('/google')
    @UseGuards(GoogleAuthGuard)
    async googleAuth(@Req() req) { 
        
     }
  
    @Get('/google/callback')
    @UseGuards(GoogleAuthGuard)
    async googleAuthRedirect(@Req() req, @Res() res) {
      //aca... con el cliente llame a la venta de la googlestrategy, que me retorna a este callback con el token de google

      //primero debo comprobar si es nuevo o no y guardar
      const resultado = await this._authService.googleLogin(req);
      if (resultado) {
        
        //luego cierro la ventana (comentado porque la ventana la cierro desde el front):
        //var responseHTML = '<html><head><title>Main</title></head><body></body><script>res = %value%; window.opener.postMessage(res, "*");window.close();</script></html>'
        var responseHTML = '<html><head><title>Main</title></head><body></body><script>res = %value%; window.opener.postMessage(res, "*");</script></html>'
          //devuelvo el jwt y el front llama 
          responseHTML = responseHTML.replace('%value%', JSON.stringify({
               user: req.user,
               token: resultado.token
           }));
           console.log(resultado);
           return res.status(200).send(responseHTML); 
      }
      else
      {
        return res.status(HttpStatus.FORBIDDEN);
      }  
    }

    @Post('/google/verificar')
    async googleVerificar(@Req() req) {
      //uso este metodo si es que ya traigo el token de google desde el cliente
      //primero debo comprobar si es nuevo o no y guardar
      return await this._authService.googleLoginAngularx(req);
    }
}
