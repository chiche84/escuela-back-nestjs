import { Controller, Post, Get, Param, Delete, Body, Req, Res, UseInterceptors, Query, UploadedFiles, HttpStatus, Put, UseGuards } from '@nestjs/common';
import { CreateAlumnoDto } from './dto/create-alumno.dto';
import { AlumnosService } from './alumnos.service';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { ValidacionAlumnoFieldsPipe } from './pipes/validacionesAlumnos.pipe';
import { diskStorage } from 'multer';
import path = require('path');
import { v4 as uuidv4 } from 'uuid';
import { catchError, map, Observable } from 'rxjs';
import { IAlumno } from './interfaces/alumno.interface';
import { createReadStream } from 'fs';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('alumnos')
export class AlumnosController {
    
  constructor(private readonly alumnoServicio: AlumnosService) {}

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
   async subirDNIaCloudinary(@Res() res, @UploadedFiles() files: Express.Multer.File[] ) {
      
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
  async crear(@Body() createAlumnoDto: CreateAlumnoDto, @Req() req, @Res() res){    
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
  async ver(@Res() res, 
            @Query('fields', new ValidacionAlumnoFieldsPipe() ) queryFields ,
            @Query('cant') queryCant: string ) {

    try {
      const alumnos = await this.alumnoServicio.verAlumnos(queryFields);
      
      res.status(200).json({
          ok: true,
          msj: "Lista de Alumnos",
          alumnos
      })
    } catch (error) {
        res.status(500).json({
            ok: false,
            msj: error,
            alumnos: null
        })
    }    
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  buscarUno(@Param('id') id: string, @Req() req, @Res() res): Observable<IAlumno> {
    
      return this.alumnoServicio.alumnoByID(id).pipe(
       map(resp=> {
          if (! resp) {
              return res.status(404).json({
                ok: true,
                msj: "No existe el Alumno con el id " + id,
                alumno: null
              });
          }
          return res.status(200).json({
            ok: true,
            msj:"Alumno encontrado",
            alumno: resp
          })
        }),   
        catchError(err => {
          return res.status(404).json({
                  ok: false,
                  msj: err,
                  alumno: null
                });
        })     
      );
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async eliminar(@Param('id') id: string, @Req() req, @Res() res) {

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
          return res.status(HttpStatus.CREATED).json(respuesta)  
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
  async modificar(@Param('id') id: string, @Body() createAlumnoDto: CreateAlumnoDto, @Req() req, @Res() res){
    try {
        const alumno = await this.alumnoServicio.modificarAlumno(id, createAlumnoDto);
        if (! alumno) {
          return res.status(404).json({
            ok: true,
            msj: "No existe el Alumno con el id " + id,
            alumno: null
          });
        }

        return res.status(201).json({
          ok: true,
          msj: "Se actualizo el Alumno",
          alumno
      })
      
    } catch (error) {
      return res.status(500).json( {
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
