import { Controller, Get, Post, Body, Patch, Param, Delete, HttpException, HttpStatus } from '@nestjs/common';
import { OpService } from './op.service';
import { CreateOpDto } from './dto/create-op.dto';
import { UpdateOpDto } from './dto/update-op.dto';

@Controller('op')
export class OpController {
  constructor(private readonly opService: OpService) {}

  @Post()
  async create(@Body() createOpDto: CreateOpDto) {
    try {
      const op = await this.opService.crearOp(createOpDto);
      return {
        ok: true,
        msj: 'Se creo la OP',
        op
      }
    } catch (error) {
      return new HttpException({
        ok: false,
        msj: error,
        op: null
      }, HttpStatus.INTERNAL_SERVER_ERROR)
    }
    
  }

  @Get()
  findAll() {
    return this.opService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.opService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateOpDto: UpdateOpDto) {
    return this.opService.update(+id, updateOpDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.opService.remove(+id);
  }
}
