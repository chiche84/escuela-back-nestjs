import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { TareasService } from './tareas.service';
import { map } from 'rxjs';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService,
              private readonly tareaServicio: TareasService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
  @Get('tareas')
  async getTareas(){
    const resultado = await this.tareaServicio.generarOP();  
    return resultado;
  }
}
