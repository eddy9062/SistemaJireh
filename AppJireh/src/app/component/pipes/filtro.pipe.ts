import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filtro',
  standalone: true
})
export class FiltroPipe implements PipeTransform {

  transform(arreglo: any[], texto: string = '', column: string = 'title'): any[] {

    if (texto === '') {
      return arreglo
    }

    if (!arreglo) {
      return arreglo
    }
    //texto = texto.toLocaleLowerCase();
    /*console.log(arreglo)
    console.log(texto)
    console.log(column)*/
    
    console.table(arreglo)

    return arreglo.filter(item => {
      return item[column].toLowerCase().includes(texto.toLocaleLowerCase())
    }
    )
  }

}
