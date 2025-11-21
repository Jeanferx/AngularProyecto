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
        // Llamada DELETE a la API
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

  leerUsuario(productos: any) {
    Swal.fire({
      title: `${productos.name}`,
      html: `
        <p><strong>name:</strong> ${productos.name}</p>
        <p><strong>Description:</strong> ${productos.Description}</p>
        <p><strong>Valor:</strong> ${productos.Valor}</p>
      `,
      icon: 'info',
      confirmButtonText: 'Cerrar',
      confirmButtonColor: '#004e92',
      background: '#f8fdff',
      color: '#004e92'
    });
  }
}
