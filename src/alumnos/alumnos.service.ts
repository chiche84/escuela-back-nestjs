import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { IAlumno } from './interfaces/alumno.interface';
import { CreateAlumnoDto } from './dto/create-alumno.dto';
import { v2 } from "cloudinary";
import { from, map, Observable } from 'rxjs';

@Injectable()
export class AlumnosService {
    constructor(@InjectModel('Alumnos') private readonly alumnoModel: Model<IAlumno>){
    }
    
      async crearAlumno(createAlumnoDto: CreateAlumnoDto) {
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
    
      alumnoByID(id: string): Observable<IAlumno> {
        return from( this.alumnoModel.findById(id))
        //   .pipe(
        //   map((resp) => {

        //     return resp;         
        //   }
        // ))
      }
     
      async modificarAlumno(id: string, updateAlumnoDto: CreateAlumnoDto): Promise<IAlumno>{     
        return await this.alumnoModel.findByIdAndUpdate(id, updateAlumnoDto, {new: true});
      }

      async eliminarAlumno(id: string): Promise<any> {
          
        //controlo dependencias antes de eliminar
       
       
        return await this.alumnoModel.findByIdAndUpdate(id, { estaActivo: false }, {new: true});;
      }
      
  
}
