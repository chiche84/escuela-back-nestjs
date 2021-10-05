import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UsuarioSchema } from './schemas/usuario.schema';
import { UsuariosService } from './usuarios.service';
import { UsuariosController } from './usuarios.controller';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Usuarios', schema: UsuarioSchema}], 'ConexionEscuelaDeDanza' ),
  ],
  controllers: [UsuariosController],
  providers: [UsuariosService],
  exports: [
    MongooseModule.forFeature([{ name: 'Usuarios', schema: UsuarioSchema}], 'ConexionEscuelaDeDanza' ),
  ]
})
export class UsuariosModule {}
