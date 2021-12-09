import { Controller, Get, Post, Body, Param, Delete, HttpException, HttpStatus, Res, Query, Put, NotFoundException, UseGuards } from '@nestjs/common';
import { OpService } from './op.service';
import { CreateOpDto } from './dto/create-op.dto';
import { UpdateOpDto } from './dto/update-op.dto';
import { Response } from 'express';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';

@Controller('op')
export class OpController {
  constructor(private readonly opService: OpService) {}

  @UseGuards(JwtAuthGuard)
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

  @UseGuards(JwtAuthGuard)
  @Get('buscarPorAlumnoxServicioMes')
  async buscarPorAlumnoxServicioMes(@Body() body:any){
    let fecha : Date;
    fecha = body.fecha;
    let idAlumnoxServicio: string = body.idAlumnoxServicio;
    let idAjuste: string = body.idAjuste;
    return await this.opService.buscarPorAlumnoxServicioMes(idAlumnoxServicio, fecha, idAjuste);
  }

  @UseGuards(JwtAuthGuard)
  @Get('buscarporestadoalumno')
  async buscarPorEstadoAlumno(@Query('estado') estado: 'impago' | 'pagado' | 'todos', @Query('idAlumno') idAlumno: string, @Res() res: Response){
        
    try {
      const ops = await this.opService.buscarPorEstadoAlumno(estado, idAlumno);

      if (ops.length == 0) {
        return res.status(HttpStatus.NO_CONTENT).json({
          ok: true,
          msj: "No se encontraron Ops en estado " + (estado ? 'impago' : 'pago'),
          ops: ops
        });
      }
      return res.status(HttpStatus.OK).json({
        ok: true,
        msj: "Ops x Estado" + estado + " del alumno " + idAlumno + "Encontradas ",
        ops: ops
      })
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        ok: false,
        msj: error,
        ops: null
      })
    }
  }
   
  @UseGuards(JwtAuthGuard)
  @Put(':id')
  update(@Param('id') id: string, @Body() updateOpDto: UpdateOpDto) {
    return this.opService.modificarOP(id, updateOpDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.opService.remove(+id);
  }
}
