import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, HttpException, HttpStatus } from '@nestjs/common';
import { AjuestesxserviciosxalumnosService } from './ajuestesxserviciosxalumnos.service';
import { CreateAjuestesxserviciosxalumnoDto } from './dto/create-ajuestesxserviciosxalumno.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('ajuestesxserviciosxalumnos')
export class AjuestesxserviciosxalumnosController {
  constructor(private readonly ajuestesxserviciosxalumnosService: AjuestesxserviciosxalumnosService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(@Body() createAjuestesxserviciosxalumnoDto: CreateAjuestesxserviciosxalumnoDto) {
    try {
      const ajustexservxalumno = await this.ajuestesxserviciosxalumnosService.crearAjustexServxAlumno(createAjuestesxserviciosxalumnoDto);
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
      const ajustexservxalumno = await this.ajuestesxserviciosxalumnosService.verAjustesxServxAlumnos();
      
      return {
        ok: true,
        msj:"Lista de Ajustes x Servicio x Alumno",
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

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.ajuestesxserviciosxalumnosService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAjuestesxserviciosxalumnoDto: CreateAjuestesxserviciosxalumnoDto) {
    return this.ajuestesxserviciosxalumnosService.update(+id, updateAjuestesxserviciosxalumnoDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.ajuestesxserviciosxalumnosService.remove(+id);
  }
}
