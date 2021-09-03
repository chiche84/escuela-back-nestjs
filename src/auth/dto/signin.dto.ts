import { IsNotEmpty, IsString } from 'class-validator';

export class SigninDto {

  id: string;
  
  nombre: string;

  //@IsNotEmpty()
  //@IsString()
  email: string;

 // @IsNotEmpty()
  //@IsString()
  password: string;
}