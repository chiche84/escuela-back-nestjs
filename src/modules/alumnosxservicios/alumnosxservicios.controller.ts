import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Res, HttpStatus, HttpException } from '@nestjs/common';
import { Response } from 'express';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { CreateAlumnosxservicioDto } from './dto/create-alumnosxservicio.dto';
import { AlumnosxServiciosService } from './alumnosxservicios.service';

@Controller('alumnosxservicios')
export class AlumnosxServiciosController {
  constructor(private readonly alumnosxserviciosService: AlumnosxServiciosService) {}

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
  async buscarUno(@Param('id') id: string){
      let alumnoxservicio = null;
      try {
        alumnoxservicio = await this.alumnosxserviciosService.alumnoxServicioById(id);
        if (alumnoxservicio.length == 0) {
          throw new Error(); 
        }
        return {
          ok: true,
          msj: "Alumno x Servicio encontrado",
          servicio: alumnoxservicio
        }
      } catch (error) {
        if (alumnoxservicio.length == 0) {
          throw new HttpException({
            ok: true,
            msj: 'No existe el alumno x servicio con el id ' + id,
            servicio: null
          }, HttpStatus.NOT_FOUND)
        }
        throw new HttpException({
          ok: false, 
          msj: error,
          servicio: null
        }, HttpStatus.INTERNAL_SERVER_ERROR)
      }
  }

  @Get('poralumno/:idAlumno')
  async buscarPorAlumno(@Param('idAlumno') id: string, @Res() res: Response) {
    try {
      const alumnoxservicios = await this.alumnosxserviciosService.alumnoxServicioByIdAlumno(id);

      if ( alumnoxservicios.length == 0) {
        return res.status(HttpStatus.OK).json({
            ok: true,
            msj: "El alumno con el id " + id + ' no tiene servicios',
            alumnoxservicios: null
        });
    }
    return res.status(HttpStatus.OK).json({
        ok: true,
        msj: "Alumno con Servicios encontrado",
        alumnoxservicios
    })
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        ok: false,
        msj: error,
        alumnoxservicios: null
      })
    }    
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateAlumnosxservicioDto: CreateAlumnosxservicioDto, @Res() res: Response) {    
    try {
      let alumnoxservicio  = await this.alumnosxserviciosService.modificarAlumnoxServicio(id, updateAlumnosxservicioDto)
      if (! alumnoxservicio) {
        return res.status(HttpStatus.NOT_FOUND).json({
            ok: true,
            msj: "No existe el Alumno x Servicio con el id " + id,
            alumnoxservicio: null
        });
    }
     
      return res.status(HttpStatus.OK).json({
          ok: true,
          msj: "Alumno x Servicio Actualizado",
          alumnoxservicio
      })
      } catch (error) {
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json( {
          ok: false,
          msj: error,
          alumnoxservicio: null
        })
    }
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return ;
  }
}
