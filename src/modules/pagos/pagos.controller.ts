import { Controller, Get, Post, Body, Patch, Param, Delete, UsePipes, ValidationPipe, HttpException, HttpStatus, UseFilters, Res } from '@nestjs/common';
import { PagosService } from './pagos.service';
import { CreatePagoDto } from './dto/create-pago.dto';
import { UpdatePagoDto } from './dto/update-pago.dto';
import { Response } from 'express';

@Controller('pagos')
export class PagosController {
  constructor(private readonly pagosService: PagosService) {}

  @UsePipes(ValidationPipe)
  @Post()
  async create(@Body() createPagoDto: CreatePagoDto, @Res() res: Response) {
       try {
      const pago = await this.pagosService.create(createPagoDto); 
      if (pago) {
        return res.status(HttpStatus.OK).json({
          ok: true,
          msj: 'Se creo el pago y actualizo la Op',
          pago
        })        
      }else{
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
          ok: false,
          msj: "Transaccion cancelada",
          pago
        })
      }
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        ok: false,
        msj: error,
        pago: null
      })
    }
  }

  @Get()
  findAll() {
    return this.pagosService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.pagosService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePagoDto: UpdatePagoDto) {
    return this.pagosService.update(+id, updatePagoDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.pagosService.remove(+id);
  }
}
