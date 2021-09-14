import { Controller, Get, Post, Body, Param, Delete, Res, Put, HttpStatus, UseGuards } from '@nestjs/common';
import { AjustesService } from './ajustes.service';
import { CreateAjusteDto } from './dto/create-ajuste.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import * as jsonwebtoken from 'jsonwebtoken';

@Controller('ajustes')
export class AjustesController {
  constructor(private readonly ajustesService: AjustesService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async crear(@Body() createAjusteDto: CreateAjusteDto, @Res() res) {

    try {
        const ajuste = await this.ajustesService.crearAjuste(createAjusteDto);
        return res.status(201).json({
          ok: true,
          msj: "Se creo el ajuste",
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
  @Get()
  async ver(@Res() res) {
    try {
      const ajustes = await this.ajustesService.verAjustes();
      
      return res.status(HttpStatus.CREATED).json({
        ok: true,
        msj:"Lista de Ajustes",
        ajustes
    })
    } catch (error) {
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
          ok: false,
          msj: error,
          ajustes: null
        })
    }    
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
    async buscarUno(@Param('id') id: string, @Res() res) {
    try {
      const ajuste = await this.ajustesService.ajusteById(id);
      if (! ajuste) {
        return res.status(404).json({
            ok: true,
            msj: "No existe el ajuste con el id " + id,
            ajuste: null
        });
    }
    return res.status(200).json({
        ok: true,
        msj: "Ajuste encontrado",
        ajuste
    })
    } catch (error) {
      return res.status(500).json({
        ok: false,
        msj: error,
        ajuste: null
      })
    }    
  }
  
  @UseGuards(JwtAuthGuard)
  @Put(':id')
  async modificar(@Param('id') id: string, @Body() updateAjusteDto: CreateAjusteDto, @Res() res) {

    try {
      let ajuste  = await this.ajustesService.modificarAjuste(id, updateAjusteDto)
      if (! ajuste) {
        return res.status(404).json({
            ok: true,
            msj: "No existe el ajuste con el id " + id,
            ajuste: null
        });
    }
     
      return res.status(201).json({
          ok: true,
          msj: "Ajuste Actualizado",
          ajuste
      })
      } catch (error) {
        return res.status(500).json( {
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
          return res.status(404).json({
              ok: true,
              msj: "No existe el ajuste con el id " + id,
              ajuste: null
          });
      }else {
        if (respuesta.ok) {
          return res.status(HttpStatus.CREATED).json(respuesta)
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
