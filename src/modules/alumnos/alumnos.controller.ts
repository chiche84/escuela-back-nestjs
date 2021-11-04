import { Controller, Post, Get, Param, Delete, Body, Req, Res, UseInterceptors, Query, UploadedFiles, HttpStatus, Put, UseGuards } from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
import { catchError, map, Observable } from 'rxjs';
import { diskStorage } from 'multer';
import path = require('path');
import { v4 as uuidv4 } from 'uuid';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { CreateAlumnoDto } from './dto/create-alumno.dto';
import { ValidacionAlumnoFieldsPipe } from './pipes/validacionesAlumnos.pipe';
import { AlumnosService } from './alumnos.service';
import { IAlumno } from './interfaces/alumno.interface';
import html_to_pdf = require('html-pdf-node');
import { Client, MessageMedia } from 'whatsapp-web.js';
var pdf = require('html-pdf');
import * as fs from 'fs';

const SESSION_FILE_PATH = '../../../session.json';

@Controller('alumnos')
export class AlumnosController {
    
  constructor(private readonly alumnoServicio: AlumnosService) {}

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
      
    let sessionData = require(SESSION_FILE_PATH);    
    
    let cliente = new Client({
        session: sessionData
    })
    cliente.on('ready', () => {});
    await cliente.initialize();
    
    const reciboNuevo = files['recibo'][0].path;   
    let options = { format: 'A4', path: '' }; 
    let file = { url: reciboNuevo };
    var html = fs.readFileSync(reciboNuevo, 'utf8');
    // html_to_pdf.generatePdf(file, options).then(pdfBuffer => {
    //   console.log("PDF Buffer: ", pdfBuffer);        
    //   const mediaFile = new MessageMedia('application/pdf', pdfBuffer);
    //   cliente.sendMessage('5493884719054@c.us', mediaFile).catch(err=> console.log(err));

    //   }).catch(error => console.log(error));
    
    pdf.create(html).toFile('./pdficito.pdf',function(err, res) {
      if (err) {
          console.log('chelink',err)
      } else {          
          console.log('res',res);
          const mediaFile = MessageMedia.fromFilePath(res.filename);
          //const mediaFile1 = MessageMedia.fromFilePath('D:\\Node\\nestJs\\escuela-de-danzas-backend-nestjs\\1-Rocio-Alarcon.pdf');
          //cliente.sendMessage('5493884719054@c.us', mediaFile.data).then(result=> console.log(result)).catch(err=> console.log('Error envio',err));
          cliente.sendMessage('5493884719054@c.us',mediaFile)
        }
    });

    try {

      return res.status(HttpStatus.OK).json({
        ok: true,
        msj: "Se subio el recibo",
        reciboNuevo
      })
      
    } catch (error) {
        return res.status(HttpStatus.UNPROCESSABLE_ENTITY).json({
          ok:false,
          msj: error,
          reciboNuevo: ''
        })
    } 
  }

  @UseGuards(JwtAuthGuard)
  @Post('subirdni')
  @UseInterceptors(FileFieldsInterceptor([
    { name: 'fotoDniFrente', maxCount: 1},
    { name: 'fotoDniDorso', maxCount: 1}
  ], {
    storage: diskStorage({      
      filename: (req, file, cb) => {
        const filename: string = path.parse(file.originalname).name.replace(/\s/g, '') + uuidv4();
        const extension: string = path.parse(file.originalname).ext;

        cb(null, `${filename}${extension}`)
      }
    })
  }))
   async subirDNIaCloudinary(@Res() res: Response, @UploadedFiles() files: Express.Multer.File[] ) {
      
    try {
      //console.log(files);
      const fotoDniFrente = await this.alumnoServicio.subirImagenaCloudinary(files['fotoDniFrente'][0].path);
      const fotoDniDorso = await this.alumnoServicio.subirImagenaCloudinary(files['fotoDniDorso'][0].path);
      return res.status(HttpStatus.OK).json({
        ok: true,
        msj: "Se subieron las fotos del dni frente y fondo a Cloudinary",
        fotoDniFrente, 
        fotoDniDorso
      })
      
    } catch (error) {
        return res.status(HttpStatus.UNPROCESSABLE_ENTITY).json({
          ok:false,
          msj: error,
          fotoDniFrente: '', 
          fotoDniDorso: ''
        })
    } 
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  async crear(@Body() createAlumnoDto: CreateAlumnoDto, @Res() res: Response){    
    try {
      console.log(createAlumnoDto);
      const alumno = await this.alumnoServicio.crearAlumno(createAlumnoDto);
      console.log(alumno);
      res.status(HttpStatus.CREATED).json({
          ok: true,
          msj: "Se creo el alumno",
          alumno
      })
    } catch (error) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        ok: false,
        msj: error,
        alumno: null
      })
    }    
  }
    
  @UseGuards(JwtAuthGuard)
  @Get()
  async ver(@Res() res: Response, 
            @Query('fields', new ValidacionAlumnoFieldsPipe() ) queryFields ,
            @Query('cant') queryCant: string ) {

    try {
      const alumnos = await this.alumnoServicio.verAlumnos(queryFields);
      
      res.status(HttpStatus.OK).json({
          ok: true,
          msj: "Lista de Alumnos",
          alumnos
      })
    } catch (error) {
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
            ok: false,
            msj: error,
            alumnos: null
        })
    }    
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  buscarUno(@Param('id') id: string, @Res() res): Observable<IAlumno> {
    
      return this.alumnoServicio.alumnoByID(id).pipe(
       map(resp=> {
          if (! resp) {
              return res.status(HttpStatus.NOT_FOUND).json({
                ok: true,
                msj: "No existe el Alumno con el id " + id,
                alumno: null
              });
          }
          return res.status(HttpStatus.OK).json({
            ok: true,
            msj:"Alumno encontrado",
            alumno: resp
          })
        }),   
        catchError(err => {
          return res.status(HttpStatus.NOT_FOUND).json({
                  ok: false,
                  msj: err,
                  alumno: null
                });
        })     
      );
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async eliminar(@Param('id') id: string, @Res() res) {

    try {
      const respuesta = await this.alumnoServicio.eliminarAlumno(id);
      if (! respuesta) {
        return res.status(HttpStatus.NOT_FOUND).json({
            ok: true,
            msj: "No existe el Alumno con el id " + id,
            alumno: null
        });
      }else{
        if (respuesta.ok) {
          return res.status(HttpStatus.OK).json(respuesta)  
        }else{
          return res.status(HttpStatus.PRECONDITION_FAILED).json(respuesta);
        }
      }      

    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json( {
        ok: false,
        msj: error,
        alumno: null
      })
    }
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  async modificar(@Param('id') id: string, @Body() createAlumnoDto: CreateAlumnoDto, @Res() res){
    try {
        const alumno = await this.alumnoServicio.modificarAlumno(id, createAlumnoDto);
        if (! alumno) {
          return res.status(HttpStatus.NOT_FOUND).json({
            ok: true,
            msj: "No existe el Alumno con el id " + id,
            alumno: null
          });
        }

        return res.status(HttpStatus.OK).json({
          ok: true,
          msj: "Se actualizo el Alumno",
          alumno
      })
      
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json( {
        ok: false,
        msj: error,
        alumno: null
      })
    }

  }


  // // Get Products /product
  //   // @Get('/list')
  //   @Get('/')
  //   async getProducts(@Res() res) {
  //       const products = await this.productService.getProducts();
  //       return res.status(HttpStatus.OK).json(products);
  //   }

  //   // GET single product: /product/5c9d46100e2e5c44c444b2d1
  //   @Get('/:productID')
  //   async getProduct(@Res() res, @Param('productID') productID) {
  //       const product = await this.productService.getProduct(productID);
  //       if (!product) throw new NotFoundException('Product does not exist!');
  //       return res.status(HttpStatus.OK).json(product);
  //   }

  //   // Delete Product: /delete?productID=5c9d45e705ea4843c8d0e8f7
  //   @Delete('/delete')
  //   async deleteProduct(@Res() res, @Query('productID') productID) {
  //       const productDeleted = await this.productService.deleteProduct(productID);
  //       if (!productDeleted) throw new NotFoundException('Product does not exist!');
  //       return res.status(HttpStatus.OK).json({
  //           message: 'Product Deleted Successfully',
  //           productDeleted
  //       });
  //   }

  //   // Update Product: /update?productID=5c9d45e705ea4843c8d0e8f7
  //   @Put('/update')
  //   async updateProduct(@Res() res, @Body() createProductDTO: CreateProductDTO, @Query('productID') productID) {
  //       const updatedProduct = await this.productService.updateProduct(productID, createProductDTO);
  //       if (!updatedProduct) throw new NotFoundException('Product does not exist!');
  //       return res.status(HttpStatus.OK).json({
  //           message: 'Product Updated Successfully',
  //           updatedProduct 
  //       });
  //   }
}
