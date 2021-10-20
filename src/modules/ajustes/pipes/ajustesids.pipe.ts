
import { PipeTransform, Injectable, ArgumentMetadata } from '@nestjs/common';

@Injectable()
export class AjustesIdsPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    if (metadata.type === 'query' ) {
      if (!value) {
        return [];
      }
      const arreglo: string[] = value.split(';');
      return arreglo;
    }
  }
}
