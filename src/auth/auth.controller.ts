import { Controller, UsePipes, Body, Post, ValidationPipe } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SigninDto } from './dto/signin.dto';

@Controller('auth')
export class AuthController {
    constructor(private readonly _authService: AuthService) {
        
    }

    @Post('/signin')
    @UsePipes(ValidationPipe)
    async signin(@Body() signinDto: SigninDto) {
    return this._authService.signin(signinDto);
  }
}
