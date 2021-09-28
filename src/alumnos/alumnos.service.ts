import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { from, Observable } from 'rxjs';
import { v2 } from "cloudinary";
import { CreateAlumnoDto } from './dto/create-alumno.dto';
import { IAlumno } from './interfaces/alumno.interface';

@Injectable()
export class AlumnosService {
    constructor(@InjectModel('Alumnos') private readonly alumnoModel: Model<IAlumno>){
    }
    
      async crearAlumno(createAlumnoDto: CreateAlumnoDto): Promise<IAlumno> {
        return  await this.alumnoModel.create(createAlumnoDto);   
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
          
        //TODO: controlo dependencias antes de eliminar
        const alumnoEliminado = await this.alumnoModel.findByIdAndUpdate(id, { estaActivo: false }, {new: true});
        if (alumnoEliminado) {
          return {
            ok: true,
            msj: 'Alumno Eliminado',
            alumnoEliminado
          }
        }
        return null;
      }
      
  
}
