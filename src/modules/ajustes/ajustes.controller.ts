import { Controller, Get, Post, Body, Param, Delete, Res, Put, HttpStatus, UseGuards, HttpException } from '@nestjs/common';
import { Response } from 'express';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { CreateAjusteDto } from './dto/create-ajuste.dto';
import { AjustesService } from './ajustes.service';

@Controller('ajustes')
export class AjustesController {
  constructor(private readonly ajustesService: AjustesService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async crear(@Body() createAjusteDto: CreateAjusteDto) {

    try {
        const ajuste = await this.ajustesService.crearAjuste(createAjusteDto);
        return {
          ok: true,
          msj: "Se creo el ajuste",
          ajuste
        }   
    } catch (error) {
        throw new HttpException({
          ok: false,
          msj: error,
          ajuste: null
        },HttpStatus.INTERNAL_SERVER_ERROR);      
    }    
  }   

  @UseGuards(JwtAuthGuard)
  @Get()
  async ver() {
    try {
      const ajustes = await this.ajustesService.verAjustes();
      
      return {
        ok: true,
        msj:"Lista de Ajustes",
        ajustes
      }
    } catch (error) {
        throw new HttpException({ 
          ok: false,
          msj: error,
          ajustes: null
        },HttpStatus.INTERNAL_SERVER_ERROR);
    }    
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
    async buscarUno(@Param('id') id: string, @Res() res: Response) {
    try {
      const ajuste = await this.ajustesService.ajusteById(id);
      if (! ajuste) {
        return res.status(HttpStatus.NOT_FOUND).json({
            ok: true,
            msj: "No existe el ajuste con el id " + id,
            ajuste: null
        });
    }
    return res.status(HttpStatus.OK).json({
        ok: true,
        msj: "Ajuste encontrado",
        ajuste
    })
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        ok: false,
        msj: error,
        ajuste: null
      })
    }    
  }
  
  @UseGuards(JwtAuthGuard)
  @Put(':id')
  async modificar(@Param('id') id: string, @Body() updateAjusteDto: CreateAjusteDto, @Res() res: Response) {

    try {
      let ajuste  = await this.ajustesService.modificarAjuste(id, updateAjusteDto)
      if (! ajuste) {
        return res.status(HttpStatus.NOT_FOUND).json({
            ok: true,
            msj: "No existe el ajuste con el id " + id,
            ajuste: null
        });
    }
     
      return res.status(HttpStatus.OK).json({
          ok: true,
          msj: "Ajuste Actualizado",
          ajuste
      })
      } catch (error) {
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json( {
          ok: false,
          msj: error,
          ajuste: null
        })
    }
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async eliminar(@Param('id') id: string,  @Res() res) {

    try {      
      let respuesta = await this.ajustesService.eliminarAjuste(id);
      
      if (! respuesta) {
          return res.status(HttpStatus.NOT_FOUND).json({
              ok: true,
              msj: "No existe el ajuste con el id " + id,
              ajuste: null
          });
      }else {
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
              ajuste: null
          })
      }
  }
}
