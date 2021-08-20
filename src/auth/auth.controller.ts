import { Controller, UsePipes, Body, Post, ValidationPipe, Req, Get, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SigninDto } from './dto/signin.dto';
import { validarTokenDto } from './dto/validarToken.dto';
import { JwtAuthGuard } from './jwt-auth.guard';

@Controller('auth')
export class AuthController {
    constructor(private readonly _authService: AuthService) {        
    }

    @Post('/login')
    @UsePipes(ValidationPipe)
    async signin(@Body() signinDto: SigninDto) {     
      return this._authService.signin(signinDto);
    }

    
    @UseGuards(JwtAuthGuard)
    @Get('/renew')
    async revalidarToken(@Body() validartoken: validarTokenDto) {
      return this._authService.revalidarToken(validartoken);
    }
}
