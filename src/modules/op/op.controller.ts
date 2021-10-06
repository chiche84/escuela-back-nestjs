import { Controller, Get, Post, Body, Patch, Param, Delete, HttpException, HttpStatus, Res } from '@nestjs/common';
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
  buscarPorAlumnoxServicioMes(@Body() body:any){
    let fecha : Date;
    fecha = body.fecha;
    let idAlumnoxServicio: string = body.idAlumnoxServicio;
    let idAjuste: string = body.idAjuste;
    return this.opService.buscarPorAlumnoxServicioMes(idAlumnoxServicio, fecha, idAjuste);
  }

  @Get()
  findAll() {
    return this.opService.findAll();
  }
  

  @Get('poralumno/:idAlumno')
  async buscarOPsPorAlumno(@Param('idAlumno') id: string, @Res() res: Response) {
    
    try {
      const opsxAlumno = await this.opService.buscarPorAlumno(id);

      if ( opsxAlumno.length == 0) {
        return res.status(HttpStatus.NOT_FOUND).json({
            ok: true,
            msj: "El alumno con el id " + id + ' no tiene Ops',
            opsxAlumno: null
        });
    }
    return res.status(HttpStatus.OK).json({
        ok: true,
        msj: "Alumno con Ops encontrado",
        opsxAlumno
    })
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        ok: false,
        msj: error,
        opsxAlumno: null
      })
    }    
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateOpDto: UpdateOpDto) {
    return this.opService.update(+id, updateOpDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.opService.remove(+id);
  }
}
