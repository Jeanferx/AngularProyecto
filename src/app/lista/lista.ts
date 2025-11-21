import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-lista',
  imports: [CommonModule, HttpClientModule],
  templateUrl: './lista.html',
  styleUrls: ['./lista.css'],
})
export class Lista {

  Productos: any[] = []; // Lista que vendrá de la API
  private apiUrl = 'https://localhost:7010/WeatherForecast';

  constructor(private http: HttpClient) {
    this.cargarUsuarios();
  }

  // Cargar IDs y luego traer cada producto por ID
  cargarUsuarios() {
    this.http.get<string[]>(`${this.apiUrl}/lista-ids`).subscribe({
      next: (ids) => {
        this.Productos = [];

        ids.forEach(id => {
          this.http.get<any>(`${this.apiUrl}/${id}`).subscribe(prod => {
            this.Productos.push(prod);
          });
        });
      }
    });
  }
  Editar(productos: any) {
    Swal.fire({
      title: 'Editar Producto',
      html: `
      <label>Nombre</label>
      <input id="swal-nombre" class="swal2-input" value="${productos.name}">

      <label>Descripcion</label>
      <input id="swal-descripcion" class="swal2-input" value="${productos.description}">

      <label>Valor</label>
      <input id="swal-valor" class="swal2-input" value="${productos.valor}">
    `,
      showCancelButton: true,
      confirmButtonText: 'Guardar',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (!result.isConfirmed) return;

      const nuevoNombre = (document.getElementById('swal-nombre') as HTMLInputElement).value;
      const nuevaDescripcion = (document.getElementById('swal-descripcion') as HTMLInputElement).value;
      const nuevoValor = (document.getElementById('swal-valor') as HTMLInputElement).value;

      // Actualiza los valores del producto
      productos.name = nuevoNombre;
      productos.description = nuevaDescripcion;
      productos.valor = nuevoValor;

      // PUT a la API
      this.http.put(`${this.apiUrl}/${productos.id}`, productos).subscribe(() => {
        Swal.fire("Listo", "Producto actualizado correctamente", "success");
      });
    });
  }



  // Eliminar
  eliminarUsuario(productos: any) {
    Swal.fire({
      title: '¿Estás seguro?',
      text: `Deseas eliminar a ${productos.nombre}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#e63946',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
      background: '#f8fdff',
      color: '#004e92'
    }).then((result) => {
      if (result.isConfirmed) {
        this.http.delete(`${this.apiUrl}/${productos.id}`).subscribe({
          next: () => {
            this.Productos = this.Productos.filter(u => u.id !== productos.id);

            Swal.fire({
              title: 'Eliminado',
              text: `${productos.nombre} ha sido eliminado correctamente.`,
              icon: 'success',
              confirmButtonColor: '#00b894',
              background: '#f8fdff',
              color: '#004e92'
            });
          },
          error: (err) => {
            console.error('Error al eliminar:', err);
            Swal.fire('Error', 'No se pudo eliminar el usuario', 'error');
          }
        });
      }
    });
  }

  // Leer
  leerUsuario(productos: any) {
    Swal.fire({
      title: `${productos.name}`,
      html: `
        <p><strong>Nombre:</strong> ${productos.name}</p>
        <p><strong>Descripción:</strong> ${productos.description}</p>
        <p><strong>Valor:</strong> ${productos.valor}</p>
      `,
      icon: 'info',
      confirmButtonText: 'Cerrar',
      confirmButtonColor: '#004e92',
      background: '#f8fdff',
      color: '#004e92'
    });
  }
}
