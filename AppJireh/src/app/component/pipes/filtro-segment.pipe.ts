import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filtroSegment',
  standalone: true
})
export class FiltroSegmentPipe implements PipeTransform {

  transform(arreglo: any[], texto: number = 0, column: string = 'title'): any[] {

    if (texto == 0) {
      return arreglo
    }

    if (!arreglo) {
      return arreglo
    }
    //texto = texto.toLocaleLowerCase();
    /*console.log(arreglo)
    console.log(texto)
    console.log(column)*/
    //return item[column].toLowerCase().includes(texto.toLocaleLowerCase())
    return arreglo.filter(item => {
      return String(item[column]).includes(String(texto))
    }
    )
  }
}
