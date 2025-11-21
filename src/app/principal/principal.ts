import { Component } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
@Component({
  selector: 'app-principal',
  imports: [FormsModule, HttpClientModule],
  templateUrl: './principal.html',
  styleUrl: './principal.css',
})
export class Principal {
  constructor(private http: HttpClient) { }

  Productos = {
    name: '', Description: '', Valor: 0
  };

  guardarEmpleado() {
    this.http.post('https://localhost:7010/WeatherForecast', this.Productos)
      .subscribe(res => console.log('Empleado guardado:', res));
  }
}
