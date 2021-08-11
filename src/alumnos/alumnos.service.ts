import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { IAlumno } from './interfaces/alumno.interface';
import { CreateAlumnoDto } from './dto/create-alumno.dto';
import { v2 } from "cloudinary";

@Injectable()
export class AlumnosService {
    constructor(@InjectModel('Alumnos') private readonly alumnoModel: Model<IAlumno>){
    }
    
      async create(createAlumnoDto: CreateAlumnoDto) {
        const newProduct = new this.alumnoModel(createAlumnoDto);
        return  newProduct.save();   
      }
    
      async verAlumnos(qcampos: string[]): Promise<IAlumno[]> {        
              
        const alumnos = await this.alumnoModel.find({ estaActivo: true }, qcampos).populate({ path:'idRefBarrio', select: 'nombreBarrio' });
        return alumnos;
      }

      async subirImagenaCloudinary (file: string): Promise<string> {      

        const cloudinary = v2;
        try {
            const rutaCloudinary = await cloudinary.uploader.upload(file, {folder:"pruebotas"});
            const ruta: string = rutaCloudinary.secure_url;
            return ruta;
        } catch (error) {
            return error;
        }
    }
    
     
     
  //   // Get all products
  //   async getProducts(): Promise<Product[]> {
  //     const products = await this.productModel.find();
  //     return products;
  // }
  
  // // Get a single Product
  // async getProduct(productID: string): Promise<Product> {
  //     const product = await this.productModel.findById(productID); 
  //     return product;
  // }

  // // Post a single product
  // async createProduct(createProductDTO: CreateProductDTO): Promise<Product> {
  //     const newProduct = new this.productModel(createProductDTO);
  //     return newProduct.save();
  // }

  // // Delete Product
  // async deleteProduct(productID: string): Promise<any> {
  //     const deletedProduct = await this.productModel.findOneAndDelete(productID);
  //     return deletedProduct;
  // }

  // // Put a single product
  // async updateProduct(productID: string, createProductDTO: CreateProductDTO): Promise<Product> {
  //     const updatedProduct = await this.productModel
  //                         .findByIdAndUpdate(productID, createProductDTO, {new: true});
  //     return updatedProduct;
  // }
}
