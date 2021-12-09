import { Controller, Get, Post, Body, Patch, Param, Delete, UsePipes, ValidationPipe,  HttpStatus, Res, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { PagosService } from './pagos.service';
import { CreatePagoDto } from './dto/create-pago.dto';
import { UpdatePagoDto } from './dto/update-pago.dto';
import { response, Response } from 'express';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { unlink } from 'fs/promises';
import path = require('path');

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

  @Post('multiples')
  async pagarMuchos(@Body() createPagosDto: CreatePagoDto[], @Res() res: Response){
    const muchos = this.pagosService.crearmuchos(createPagosDto);
    return res.status(HttpStatus.OK).json({
      ok: true,
      muchos
    })
  }

  @Post('subirrecibo')
  @UseInterceptors(FileFieldsInterceptor([
    { name: 'recibo', maxCount: 1},
  ], {
    storage: diskStorage({      
      filename: (req, file, cb) => {
        const filename: string = 'reciboParaEnviar';
        const extension: string = path.parse(file.originalname).ext;
        cb(null, `${filename}${extension}`)
      }
    })
  }))
  async subirRecibo(@Body() body, @Res() res: Response, @UploadedFiles() files: Express.Multer.File[] ) {
          
    const reciboNuevo = files['recibo'][0].path;   
    const nombrePdf = body.idPago; 
    const resul =  await this.pagosService.crearRecibo(reciboNuevo, nombrePdf);
    console.log('Resultado', resul);
    return res.json({nombrePdf});

    // if (crearRecibo !== null) {
    //   let direccionEmail = 'chiche84@gmail.com';
    //   const enviarMail = await this.pagosService.enviarEmailRecibo(direccionEmail,nombrePdf);
    //   if (enviarMail !== null) {
    //     return res.status(HttpStatus.OK).json({
    //       ok: true,
    //       msj: 'Email enviado correctamente a ' + direccionEmail, 
    //     })
    //   }else{
    //     return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
    //       ok: false,
    //       msj: 'No se pudo enviar el Email', 
    //     })
    //   }
    // }else{
    //   return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
    //     ok: false,
    //     msj: 'No se pudo crear el recibo', 
    //   })
    // }

  }
  
  @Get('enviarrecibo/:nombre/:email')
  async enviarRecibo(@Param('nombre') nombreArchivo: string, @Param('email') email: string, @Res() res: Response){
    
    const enviarMail = await this.pagosService.enviarEmailRecibo(email, nombreArchivo);
      if (enviarMail !== null) {
        return res.status(HttpStatus.OK).json({
          ok: true,
          msj: 'Email enviado correctamente a ' + email, 
        })
      }else{
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
          ok: false,
          msj: 'No se pudo enviar el Email', 
        })
      }
  }
  
  @Get('descargarrecibo/:nombre')
  async descargarRecibo(@Param('nombre') nombreArchivo: string, @Res() res: Response){

    res.download(__dirname + `../../../../${nombreArchivo}.pdf`, (err) => {
      if (err){
        console.log('No se encontro el archivo');  
        res.json({ok: false, msj: 'No se encontro el archivo'});
        res.end();
      }else{       
        unlink(`./${nombreArchivo}.pdf`); 
      }
    });    
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
