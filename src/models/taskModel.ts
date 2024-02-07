export interface Task{
    id_tarea: number,
    id_usuario: number,
    title: string,
    descripcion: string,
    fecha: Date,
    items: Item[]
  }
  
  export interface Item {
      item: number,
      name: string,
      completed: boolean
  }