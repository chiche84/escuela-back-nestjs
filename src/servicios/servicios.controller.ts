import { Controller, Get, Post, Body, Patch, Param, Delete, Res, Put, HttpStatus, UseGuards } from '@nestjs/common';
import { ServiciosService } from './servicios.service';
import { CreateServicioDto } from './dto/create-servicio.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('servicios')
export class ServiciosController {
  constructor(private readonly serviciosService: ServiciosService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async crear(@Body() createServicioDto: CreateServicioDto, @Res() res) {

    try {
        const servicio = await this.serviciosService.crearServicio(createServicioDto);
        return res.status(201).json({
          ok: true,
          msj: "Se creo el servicio",
          servicio
        })   
    } catch (error) {
        return res.status(500).json({
          ok: false,
          msj: error,
          servicio: null
        })    
    }    
  }   

  @UseGuards(JwtAuthGuard)
  @Get()
  async ver(@Res() res) {
    try {
      const servicios = await this.serviciosService.verServicios();
      
      return res.status(200).json({
        ok: true,
        msj:"Lista de Servicios",
        servicios
    })
    } catch (error) {
        return res.status(500).json({
          ok: false,
          msj: error,
          servicios: null
        })
    }    
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
    async buscarUno(@Param('id') id: string, @Res() res) {
    try {
      const servicio = await this.serviciosService.servicioById(id);
      if (! servicio) {
        return res.status(404).json({
            ok: true,
            msj: "No existe el servicio con el id " + id,
            servicio: null
        });
    }
    return res.status(200).json({
        ok: true,
        msj: "Servicio encontrado",
        servicio: servicio
    })
    } catch (error) {
      return res.status(500).json({
        ok: false,
        msj: error,
        servicio: null
      })
    }    
  }
  
  @UseGuards(JwtAuthGuard)
  @Put(':id')
  async modificar(@Param('id') id: string, @Body() updateServicioDto: CreateServicioDto, @Res() res) {

    try {
      let servicio  = await this.serviciosService.modificarServicio(id, updateServicioDto)
      if (! servicio) {
        return res.status(404).json({
            ok: true,
            msj: "No existe el servicio con el id " + id,
            servicio: null
        });
    }
     
      return res.status(201).json({
          ok: true,
          msj: "Servicio Actualizado",
          servicio
      })
      } catch (error) {
        return res.status(500).json( {
          ok: false,
          msj: error,
          servicio: null
        })
    }
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async elimminar(@Param('id') id: string,  @Res() res) {

    try {      
      let respuesta = await this.serviciosService.eliminarServicio(id);
      
      if (! respuesta) {
          return res.status(404).json({
              ok: true,
              msj: "No existe el servicio con el id " + id,
              servicio: null
          });
      }
        
      if (respuesta.ok) {
        return res.status(201).json({
            ok: true,
            msj: "Servicio Eliminado",
            servicio: respuesta
        })          
      } else {
          return res.status(HttpStatus.FORBIDDEN).json(respuesta);
      }
      
      
      } catch (error) {
          return res.status(500).json( {
              ok: false,
              msj: error,
              servicio: null
          })
      }
  }
}
