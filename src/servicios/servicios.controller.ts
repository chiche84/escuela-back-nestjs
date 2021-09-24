import { Controller, Get, Post, Body, Patch, Param, Delete, Res, Put, HttpStatus, UseGuards, HttpException } from '@nestjs/common';
import { ServiciosService } from './servicios.service';
import { CreateServicioDto } from './dto/create-servicio.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Response } from 'express';
import { map, catchError, tap, filter } from 'rxjs';

@Controller('servicios')
export class ServiciosController {
  constructor(private readonly serviciosService: ServiciosService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async crear(@Body() createServicioDto: CreateServicioDto) {

    try {
        const servicio = await this.serviciosService.crearServicio(createServicioDto);
        return {
          ok: true,
          msj: "Se creo el servicio",
          servicio
        }; 
    } catch (error) {
        throw new HttpException({
          ok: false,
          msj: error,
          servicio: null
        }, HttpStatus.INTERNAL_SERVER_ERROR);
    }    
  }   

  @UseGuards(JwtAuthGuard)
  @Get()
  async ver(@Res() res: Response) {
    try {
      const servicios = await this.serviciosService.verServicios();
      
      return res.status(HttpStatus.OK).json({
        ok: true,
        msj:"Lista de Servicios",
        servicios
    })
    } catch (error) {
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
          ok: false,
          msj: error,
          servicios: null
        })
    }    
  }
  
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async buscarUno(@Param('id') id: string) { 
    //3 versiones:
    //* (1) con decorador @Res en los parametros del metodo - promesa
    //* (2) con la response que ya viene en nestjs - promesa
    //* (3) con observable y el response que ya viene (2)
    
      //(1)
      // try {
      //   const servicio = await this.serviciosService.servicioById(id);
      //   if (! servicio) {
      //     return res.status(404).json({
      //         ok: true,
      //         msj: "No existe el servicio con el id " + id,
      //         servicio: null
      //     });
      // }
      // return res.status(200).json({
      //     ok: true,
      //     msj: "Servicio encontrado",
      //     servicio: servicio
      // })
      // } catch (error) {
      //   return res.status(500).json({
      //     ok: false,
      //     msj: error,
      //     servicio: null
      //   })
      // }    
      
      //(2)
      // let servicio = null;
      // try {
      //   servicio = await this.serviciosService.servicioById(id);
      //   if (! servicio) {
      //     throw new Error(); 
      //   }
      //   return {
      //     ok: true,
      //     msj: "Servicio encontrado",
      //     servicio: servicio
      //   }
      // } catch (error) {
      //   if (! servicio) {
      //     throw new HttpException({
      //       ok: true,
      //       msj: 'No existe el servicio con el id ' + id,
      //       servicio: null
      //     }, HttpStatus.NOT_FOUND)
      //   }
      //   throw new HttpException({
      //     ok: false, 
      //     msj: error,
      //     servicio: null
      //   }, HttpStatus.INTERNAL_SERVER_ERROR)
      // }

      //(3)
      let servicio = null;
      return this.serviciosService.servicioById(id).pipe(        
        map(serv=> {
              servicio = serv;
              if (! servicio) {
                throw new Error(); 
              }
              return {
                      ok: true,
                      msj: "Servicio encontrado",
                      servicio: serv
                    }
            }),
          catchError(err => {                 
                   if (! servicio) {
                      throw new HttpException({
                        ok: true,
                        msj: 'No existe el servicio con el id ' + id,
                        servicio: null
                      }, HttpStatus.NOT_FOUND)
                    }
                    throw new HttpException({
                      ok: false, 
                      msj: err,
                      servicio: null
                    }, HttpStatus.INTERNAL_SERVER_ERROR)        
          })
      )

  }
  
  @UseGuards(JwtAuthGuard)
  @Put(':id')
  async modificar(@Param('id') id: string, @Body() updateServicioDto: CreateServicioDto, @Res() res: Response) {

    try {
      let servicio  = await this.serviciosService.modificarServicio(id, updateServicioDto)
      if (! servicio) {
        return res.status(HttpStatus.NOT_FOUND).json({
            ok: true,
            msj: "No existe el servicio con el id " + id,
            servicio: null
        });
    }
     
      return res.status(HttpStatus.OK).json({
          ok: true,
          msj: "Servicio Actualizado",
          servicio
      })
      } catch (error) {
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json( {
          ok: false,
          msj: error,
          servicio: null
        })
    }
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async eliminar(@Param('id') id: string,  @Res() res: Response) {

    try {      
      let respuesta = await this.serviciosService.eliminarServicio(id);
      
      if (! respuesta) {
          return res.status(HttpStatus.NOT_FOUND).json({
              ok: true,
              msj: "No existe el servicio con el id " + id,
              servicio: null
          });
      }else{
        if (respuesta.ok) {
          return res.status(HttpStatus.OK).json(respuesta)  
        }else{
          return res.status(HttpStatus.PRECONDITION_FAILED).json(respuesta); 
        }
      }       
      
      } catch (error) {
          return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json( {
              ok: false,
              msj: error,
              servicio: null
          })
      }
  }
}
