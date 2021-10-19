import { Controller, Get, Post, Body, Param, Delete, HttpException, HttpStatus, Res, Query, Put } from '@nestjs/common';
import { OpService } from './op.service';
import { CreateOpDto } from './dto/create-op.dto';
import { UpdateOpDto } from './dto/update-op.dto';
import { Response } from 'express';

@Controller('op')
export class OpController {
  constructor(private readonly opService: OpService) {}

  @Post()
  async create(@Body() createOpDto: CreateOpDto) {
    try {
      const op = await this.opService.crearOp(createOpDto);
      return {
        ok: true,
        msj: 'Se creo la OP',
        op
      }
    } catch (error) {
      return new HttpException({
        ok: false,
        msj: error,
        op: null
      }, HttpStatus.INTERNAL_SERVER_ERROR)
    }
    
  }

  @Get('buscarPorAlumnoxServicioMes')
  async buscarPorAlumnoxServicioMes(@Body() body:any){
    let fecha : Date;
    fecha = body.fecha;
    let idAlumnoxServicio: string = body.idAlumnoxServicio;
    let idAjuste: string = body.idAjuste;
    return await this.opService.buscarPorAlumnoxServicioMes(idAlumnoxServicio, fecha, idAjuste);
  }

  @Get('buscarporestadoalumno')
  async buscarPorEstadoAlumno(@Query('estado') estado: 'impago' | 'pagado' | 'todos', @Query('idAlumno') idAlumno: string, @Res() res: Response){
        
    try {
      const opsxEstadoAlumno = await this.opService.buscarPorEstadoAlumno(estado, idAlumno);

      if (opsxEstadoAlumno.length == 0) {
        return res.status(HttpStatus.NOT_FOUND).json({
          ok: true,
          msj: "No se encontraron Ops en estado " + (estado ? 'impago' : 'pago'),
          opsxEstadoAlumno: opsxEstadoAlumno
        });
      }
      return res.status(HttpStatus.OK).json({
        ok: true,
        msj: "Ops Encontradas",
        opsxEstadoAlumno: opsxEstadoAlumno
      })
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        ok: false,
        msj: error,
        opsxEstadoAlumno: null
      })
    }
  }
   

  @Put(':id')
  update(@Param('id') id: string, @Body() updateOpDto: UpdateOpDto) {
    return this.opService.modificarOP(id, updateOpDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.opService.remove(+id);
  }
}
