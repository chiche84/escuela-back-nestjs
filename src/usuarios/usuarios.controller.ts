import { Controller, Get, Post, Body, Patch, Param, Delete, Res, HttpStatus } from '@nestjs/common';
import { UsuariosService } from './usuarios.service';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';

@Controller('usuarios')
export class UsuariosController {
  constructor(private readonly _usuariosService: UsuariosService) {}

  @Post()
  async create(@Body() createUsuarioDto: CreateUsuarioDto,  @Res() res) {
    try {      
      let respuesta = await this._usuariosService.crearUsuario(createUsuarioDto);
      
     
      if (respuesta) {
        return res.status(201).json({
            ok: true,
            msj: "Usuario creado",
            usuario: respuesta
        })          
      } else {
        return res.status(500).json( {
            ok: false,
            msj: 'Ya existe un usuario con ese email',
            usuario: null
      })
      }
      
      
      } catch (error) {
          return res.status(500).json( {
              ok: false,
              msj: error,
              usuario: null
          })
      }
  }

  @Get()
  findAll() {
    return this._usuariosService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this._usuariosService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUsuarioDto: UpdateUsuarioDto) {
    return this._usuariosService.update(+id, updateUsuarioDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this._usuariosService.remove(+id);
  }
}
