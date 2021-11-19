import { Controller, Get, Post, Body, Patch, Param, Delete, UsePipes, ValidationPipe,  HttpStatus, Res, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { PagosService } from './pagos.service';
import { CreatePagoDto } from './dto/create-pago.dto';
import { UpdatePagoDto } from './dto/update-pago.dto';
import { Response } from 'express';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import html_to_pdf = require('html-pdf-node');
import path = require('path');
import * as fs from 'fs/promises';
import * as nodemailer from 'nodemailer';

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
  async subirRecibo(@Res() res: Response, @UploadedFiles() files: Express.Multer.File[] ) {
          
    const reciboNuevo = files['recibo'][0].path;   
    let options = {width:'646px', heigth:'359px', path: '',  args: ['--no-sandbox', '--disable-setuid-sandbox'] }; 
   
    let html = '';
    await fs.readFile(reciboNuevo, 'utf8')
      .then(arch => {
                  html = arch;                  
                  return fs.writeFile('./htmlicito.html',html);
      })
      .then(resp=> { console.log("Ruta: ", resp)})
      .catch(console.log)

    let absolutePath = path.resolve("./htmlicito.html");    
    let file = { url: absolutePath}

    let transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'elantigal@gmail.com',
        pass: 'dtqugmeaeubkuhfh'
      }
    });
    
    let mailOptions = {}

    //convierte bien si viene el objeto url completo con el html completo (con encabezado y todo)
    await html_to_pdf.generatePdf(file, options).then(pdfBuffer => {
      console.log("PDF Buffer: ", pdfBuffer); 
      fs.writeFile('./htmlicito.pdf', pdfBuffer).then()
        .catch( (err)=> {
              if (err) {
                console.log("ERROR AL ESCRIBIR 1",err);
              }
            });

      mailOptions = {
        from: 'elantigal@gmail.com',
        to: 'chiche84@gmail.com',
        subject: `Recibo Email`,
        html:`Se adjunta el recibo de pago del mes de..`,
        attachments: [           
          {   // binary buffer as an attachment
            filename: 'recibito.pdf',
            content: Buffer.from(pdfBuffer,'utf-8')
        },
        ]
      };

    }).catch(error => console.log(error));
    
    transporter.sendMail(mailOptions, function(error, info){
              if (error) {
                console.log(error);
                return res.status(HttpStatus.CONFLICT).json({
                  ok: false,
                  msj: error
                }) 
              } else {
                console.log('Email enviado: ' + info.response);
                return res.status(HttpStatus.OK).json({
                  ok: true,
                  msj: 'Email enviado'
                })
              }
            });

    
    
    //este convierte pal aca.. nose porque.. buscar otro o sino busar html a imagen
    // pdf.create(html).toFile('./pdficito.pdf',function(err, res) {
    //   if (err) {
    //       console.log('chelink',err)
    //   } else {          
    //       console.log('res',res);         
    //     }
    // });
    

    // try {

    //   return res.status(HttpStatus.OK).json({
    //     ok: true,
    //     msj: "Se subio el recibo",
    //     reciboNuevo
    //   })
      
    // } catch (error) {
    //     return res.status(HttpStatus.UNPROCESSABLE_ENTITY).json({
    //       ok:false,
    //       msj: error,
    //       reciboNuevo: ''
    //     })
    // } 
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
