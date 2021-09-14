import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Res, HttpStatus, HttpException } from '@nestjs/common';
import { AlumnosxserviciosService } from './alumnosxservicios.service';
import { CreateAlumnosxservicioDto } from './dto/create-alumnosxservicio.dto';
import { UpdateAlumnosxservicioDto } from './dto/update-alumnosxservicio.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Response } from 'express';

@Controller('alumnosxservicios')
export class AlumnosxserviciosController {
  constructor(private readonly alumnosxserviciosService: AlumnosxserviciosService) {}

  @UseGuards(JwtAuthGuard)  
  @Post()
  async crear(@Body() createAlumnosxservicioDto: CreateAlumnosxservicioDto){//, @Res() res: Response) {     
    
    try {      
      const alumnoxservicio = await this.alumnosxserviciosService.crearAlumnoxServicio(createAlumnosxservicioDto);
      
      return {
        ok: true,
        msj: 'Se creo el alumno x servicio',
        alumnoxservicio
      }
    } catch (error) {
      throw new HttpException({
        ok: false,
        msj: error,
        alumnoxservicio: null
      }, HttpStatus.INTERNAL_SERVER_ERROR)
      
    }
     

    // try {
    //   const alumnoxservicio = await this.alumnosxserviciosService.crearAlumnoxServicio(createAlumnosxservicioDto);      
    //   return res.status(HttpStatus.CREATED).json({
    //     ok: true,
    //     msj: 'Se creo el alumno x servicio',
    //     alumnoxservicio
    //   })
    // } catch (error) {
    //   return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
    //     ok: false,
    //     msj: error,
    //     alumnoxservicio: null
    //   })
    // }
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async findAll(){

    try {
      const alumnosxservicios = await this.alumnosxserviciosService.verAlumnosxServicios();
      return {
        ok: true,
        msj: 'Lista de alumnos x servicios',
        alumnosxservicios
      }
    } catch (error) {
      throw new HttpException({
        ok: false,
        msj: error,
        alumnosxservicios: null
      }, 
      HttpStatus.INTERNAL_SERVER_ERROR)      
    }     
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.alumnosxserviciosService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAlumnosxservicioDto: UpdateAlumnosxservicioDto) {
    return this.alumnosxserviciosService.update(+id, updateAlumnosxservicioDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.alumnosxserviciosService.remove(+id);
  }
}
