import { PipeTransform, Injectable, ArgumentMetadata } from '@nestjs/common';

@Injectable()
export class ValidacionAlumnoFieldsPipe implements PipeTransform {
  transform(value: string, metadata: ArgumentMetadata) {      
      if (metadata.type === 'query' ) {
        if (!value) {
            return ['nombre', 'apellido', 'fechaNacimiento', 'dni', 'fotoDniFrente', 'fotoDniDorso', 'email', 'domicilioCalle' ,'domicilioNro', 'idRefBarrio'];
        }                   
        const arreglo: string[] = value.split(";");
        return arreglo;          
      }
      return value;
  }
}