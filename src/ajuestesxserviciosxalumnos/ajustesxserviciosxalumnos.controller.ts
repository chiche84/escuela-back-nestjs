import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, HttpException, HttpStatus } from '@nestjs/common';
import { AjustesxserviciosxalumnosService } from './ajustesxserviciosxalumnos.service';
import { CreateAjustesxserviciosxalumnoDto } from './dto/create-ajustesxserviciosxalumno.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('ajustesxserviciosxalumnos')
export class AjustesxserviciosxalumnosController {
  constructor(private readonly ajuestesxserviciosxalumnosService: AjustesxserviciosxalumnosService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(@Body() createAjustesxserviciosxalumnoDto: CreateAjustesxserviciosxalumnoDto) {
    try {
      const ajustexservxalumno = await this.ajuestesxserviciosxalumnosService.crearAjustexServxAlumno(createAjustesxserviciosxalumnoDto);
      return {
        ok: true,
        msj: "Se creo el ajuste x servicio x alumno",
        ajustexservxalumno
      }   
    } catch (error) {
      throw new HttpException({
        ok: false,
        msj: error,
        ajustexservxalumno: null
      },HttpStatus.INTERNAL_SERVER_ERROR);      
    }    
    
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async ver() {
    try {
      const ajustesxservxalumno = await this.ajuestesxserviciosxalumnosService.verAjustesxServxAlumnos();
      
      return {
        ok: true,
        msj:"Lista de Ajustes x Servicio x Alumno",
        ajustesxservxalumno
      }
    } catch (error) {
        throw new HttpException({ 
          ok: false,
          msj: error,
          ajustesxservxalumno: null
        },HttpStatus.INTERNAL_SERVER_ERROR);
    }    
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.ajuestesxserviciosxalumnosService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAjuestesxserviciosxalumnoDto: CreateAjustesxserviciosxalumnoDto) {
    return this.ajuestesxserviciosxalumnosService.update(+id, updateAjuestesxserviciosxalumnoDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.ajuestesxserviciosxalumnosService.remove(+id);
  }
}
