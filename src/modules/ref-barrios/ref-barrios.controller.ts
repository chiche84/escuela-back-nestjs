import { Controller, Get, Post, Body, Param, Delete, Res, Put, HttpStatus, UseGuards, HttpException } from '@nestjs/common';
import { map, Observable, catchError } from 'rxjs';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { CreateRefBarrioDto } from './dto/create-ref-barrio.dto';
import { RefBarriosService } from './ref-barrios.service';
import { IRefBarrio } from './interfaces/ref-barrio.interface';

@Controller('refbarrios')
export class RefBarriosController {
  constructor(private readonly refBarriosService: RefBarriosService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  // async crear(@Body() createRefBarrioDto: CreateRefBarrioDto, @Res() res) {

  //   try {
  //       const barrio = await this.refBarriosService.crearBarrio(createRefBarrioDto);
  //       return res.status(201).json({
  //         ok: true,
  //         msj: "Barrio Creado",
  //         barrio
  //       })     
  //   } catch (error) {
  //       res.status(500).json({
  //         ok: false,
  //         msj: error,
  //         barrio: null
  //       })      
  //   }
    
  // }   
  crear (@Body() createRefBarrioDto: CreateRefBarrioDto, @Res() res): Observable<IRefBarrio> {
    return this.refBarriosService.crearBarrio(createRefBarrioDto)
      .pipe(
        map(barrio => {
            return res.status(201).json({
                  ok: true,
                  msj: "Barrio Creado",
                  barrio
            }) 
          }),  
        catchError( err => {          
            return res.status(500).json({
                ok: false,
                msj: err,
                barrio: null
            })    
          })  
      );
  }

  @Get('orm')
  async verORM(@Res() res) {
    try {
      const barrios = await this.refBarriosService.verBarrios1();
      
      res.status(200).json({
          ok: true,
          msj: "Lista de Barrios ORM",
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

  //@UseGuards(JwtAuthGuard)
  @Get()
  // async ver(@Res() res) {
  //   try {
  //     const barrios = await this.refBarriosService.verBarrios();
      
  //     res.status(200).json({
  //         ok: true,
  //         msj: "Lista de Barrios",
  //         barrios
  //     })
  //   } catch (error) {
  //       res.status(500).json({
  //           ok: false,
  //           msj: error,
  //           barrios: null
  //       })
  //   }    
  // }
  ver(@Res() res): Observable<IRefBarrio[]>{
    return this.refBarriosService.verBarrios()
      .pipe(
        map( barrios => {
          return res.status(200).json({
              ok: true,
              msj: "Lista de Barrios",
              barrios
          })
        }),
        catchError( err => {
          return res.status(500).json({
              ok: false,
              msj: err,
              barrios: null
          })
        })
      );
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  // async findOne(@Param('id') id: string, @Res() res) {
  //   try {
  //     const barrio = await this.refBarriosService.barrioById(id);
  //     if (! barrio) {
  //         return res.status(404).json({
  //             ok: true,
  //             msj: "No existe el barrio con el id " + id,
  //             barrio: null
  //         });
  //     }
  //     return res.status(200).json({
  //         ok: true,
  //         msj: "Barrio encontrado",
  //         barrio
  //     })
  //   } catch (error) {
  //     return res.status(500).json({
  //           ok: false,
  //           msj: error,
  //           barrio: null
  //       })
  //   }    
  // }
  buscarUno(@Param('id') id: string, @Res() res): Observable<IRefBarrio> {
    return this.refBarriosService.barrioById(id)
      .pipe(
        map( barrio=> {
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
        }),
        catchError(err=> {
          return res.status(500).json({
            ok: false,
            msj: err,
            barrio: null
          })
        })
      );
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  // async update(@Param('id') id: string, @Body() updateRefBarrioDto: CreateRefBarrioDto, @Res() res) {

  //   try {
  //     let barrio  = await this.refBarriosService.actualizarBarrio(id, updateRefBarrioDto)
  //     if (! barrio) {
  //         return res.status(404).json({
  //             ok: true,
  //             msj: "No existe el barrio con el id " + id,
  //             barrio: null
  //         });
  //     }
     
  //     return res.status(201).json({
  //         ok: true,
  //         msj: "Barrio Actualizado",
  //         barrio
  //     })
  //     } catch (error) {
  //         return res.status(500).json( {
  //             ok: false,
  //             msj: error,
  //             barrio: null
  //         })
  //   }
  // }
  modificar(@Param('id') id: string, @Body() updateRefBarrioDto: CreateRefBarrioDto, @Res() res): Observable<IRefBarrio>{
    return this.refBarriosService.modificarBarrio(id, updateRefBarrioDto)
      .pipe(
        map(barrio => {
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
        }),
        catchError( err => {
          return res.status(500).json( {
                        ok: false,
                        msj: err,
                        barrio: null
            })
        })
      );
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async eliminar(@Param('id') id: string,  @Res() res) {

    try {      
      let respuesta = await this.refBarriosService.eliminarBarrio(id);
      
      if (! respuesta) {
          return res.status(HttpStatus.NOT_FOUND).json({
              ok: true,
              msj: "No existe el barrio con el id " + id,
              barrio: null
          });
      }else{
        if (respuesta.ok) {
          return res.status(HttpStatus.CREATED).json(respuesta)  
        }else{
          return res.status(HttpStatus.PRECONDITION_FAILED).json(respuesta); //si no lo mando con el estatus de error, el obs del front en angular no entra al catcherror
          //return res.json(respuesta);
        }
      }              
      
      } catch (error) {
          return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json( {
              ok: false,
              msj: error,
              barrio: null
          })
      }
  }
  
}
