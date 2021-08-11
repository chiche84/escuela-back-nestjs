import { Controller, Get, Post, Body, Param, Delete, Res, Put } from '@nestjs/common';
import { RefBarriosService } from './ref-barrios.service';
import { CreateRefBarrioDto } from './dto/create-ref-barrio.dto';

@Controller('refbarrios')
export class RefBarriosController {
  constructor(private readonly refBarriosService: RefBarriosService) {}

  @Post()
  async crear(@Body() createRefBarrioDto: CreateRefBarrioDto, @Res() res) {

    try {
        const barrio = await this.refBarriosService.crearBarrio(createRefBarrioDto);
        return res.status(201).json({
          ok: true,
          msj: "Barrio Creado",
          barrio
        })      
    } catch (error) {
        res.status(500).json({
          ok: false,
          msj: error,
          barrio: null
        })      
    }
    
  }   

  @Get()
  async ver(@Res() res) {
    try {
      const barrios = await this.refBarriosService.verBarrios();
      
      res.status(200).json({
          ok: true,
          msj: "Lista de Barrios",
          barrios
      })
    } catch (error) {
        res.status(500).json({
            ok: false,
            msj: error,
            barrios: null
        })
    }    
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @Res() res) {
    try {
      const barrio = await this.refBarriosService.barrioById(id);
      if (! barrio) {
          return res.status(404).json({
              ok: true,
              msj: "No existe el barrio con el id " + id,
              barrio: null
          });
      }
      return res.status(200).json({
          ok: true,
          msj: "Barrio encontrado",
          barrio
      })
    } catch (error) {
      return res.status(500).json({
            ok: false,
            msj: error,
            barrio: null
        })
    }    
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateRefBarrioDto: CreateRefBarrioDto, @Res() res) {

    try {
      let barrio  = await this.refBarriosService.actualizarBarrio(id, updateRefBarrioDto)
      if (! barrio) {
          return res.status(404).json({
              ok: true,
              msj: "No existe el barrio con el id " + id,
              barrio: null
          });
      }
     
      return res.status(201).json({
          ok: true,
          msj: "Barrio Actualizado",
          barrio
      })
      } catch (error) {
          return res.status(500).json( {
              ok: false,
              msj: error,
              barrio: null
          })
    }
  }

  @Delete(':id')
  async remove(@Param('id') id: string,  @Res() res) {

    try {
      let barrio  = await this.refBarriosService.eliminarBarrio(id)
      if (! barrio) {
          return res.status(404).json({
              ok: true,
              msj: "No existe el barrio con el id " + id,
              barrio: null
          });
      }
     
      return res.status(201).json({
          ok: true,
          msj: "Barrio Eliminado",
          barrio
      })
      } catch (error) {
          return res.status(500).json( {
              ok: false,
              msj: error,
              barrio: null
          })
      }
  }
}
