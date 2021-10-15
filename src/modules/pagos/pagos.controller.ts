import { Controller, Get, Post, Body, Patch, Param, Delete, UsePipes, ValidationPipe, HttpException, HttpStatus, UseFilters } from '@nestjs/common';
import { PagosService } from './pagos.service';
import { CreatePagoDto } from './dto/create-pago.dto';
import { UpdatePagoDto } from './dto/update-pago.dto';

@Controller('pagos')
export class PagosController {
  constructor(private readonly pagosService: PagosService) {}

  @UsePipes(ValidationPipe)
  @Post()
  async create(@Body() createPagoDto: CreatePagoDto) {
       try {
      const pago = await this.pagosService.create(createPagoDto); 
      
      return {
        ok: true,
        msj: 'Se creo el pago',
        pago
      }
    } catch (error) {
      return new HttpException({
        ok: false,
        msj: error,
        pago: null
      }, HttpStatus.INTERNAL_SERVER_ERROR)
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
