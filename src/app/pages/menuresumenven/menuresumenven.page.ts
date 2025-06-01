import { Component, OnInit } from '@angular/core';
import { FirestoredatabaseService } from 'src/app/services/firestoredatabase.service';
import { AuthfirebaseService } from 'src/app/services/authfirebase.service';
import { UsuarioI } from 'src/app/models/modelos';
import { Chart } from 'chart.js';

@Component({
  selector: 'app-menuresumenven',
  templateUrl: './menuresumenven.page.html',
  styleUrls: ['./menuresumenven.page.scss'],
})
export class MenuresumenvenPage implements OnInit {

  usuario: string = null;
  perfil: string = null;
  taller: string = null;

  constructor(
    private auth: AuthfirebaseService,
    private firestore: FirestoredatabaseService
  ) {
    this.auth.estadousuario().subscribe(res => {
      if (res) {
        this.obtenerusuario(res.uid)
      }
    })
  }

  ngOnInit() {
    this.graficoI();
    this.graficoII();
  }

  obtenerusuario(uid: string) {
    const path = 'Usuarios';
    const id = uid;
    this.firestore.getDoc<UsuarioI>(path, id).subscribe(res => {
      if (res) {
        this.perfil = res.cargo
        this.taller = res.nombretaller
        this.usuario = res.nombre
      }
    })
    this.graficoI();
    this.graficoII();
  }

  graficoI() {
    const canvas = document.getElementById('hodtChart');
    const ctx = (canvas as HTMLCanvasElement).getContext('2d');
    const hodtChart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: ['Semana 1', 'Semana 2', 'Semana 3', 'Semana 4'],
        datasets: [{
          label: 'Cantidad de ordenes',
          data: [19, 23, 2, 22],
          backgroundColor: [
            'rgba(1, 46, 228, 1)',
          ],
          borderColor: [
            'rgba(1, 46, 228, 1)'
          ],
          borderWidth: 1
        }]
      },
      options: {
        scales: {
          y: {
            beginAtZero: true,
            
          },
          x: {
            display: true,
            title: {
              display: true,
              text: 'Noviembre',
              font: {
                size: 20
              },
              padding: {
                top: 10
              }
            }
          }
        }
      }
    });
  }

  graficoII() {
    const canvas = document.getElementById('rmChart');
    const ctx = (canvas as HTMLCanvasElement).getContext('2d');
    const rmChart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: ['Junio','Julio','Agosto','Septiembre','Octubre','Noviembre'],
        datasets: [{
          label: 'Monto recaudado en CLP',
          data: [ (33*5000), (33*5000), (39*5000), (59*5000), (46*5000), (66*5000)],
          backgroundColor: [
            'rgba(255, 99, 132, 0.2)',
            'rgba(54, 162, 235, 0.2)',
            'rgba(255, 206, 86, 0.2)',
            'rgba(75, 192, 192, 0.2)',
            'rgba(153, 102, 255, 0.2)',
            'rgba(255, 159, 64, 0.2)',
          ],
          borderColor: [
            'rgba(255, 99, 132, 1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)',
            'rgba(75, 192, 192, 1)',
            'rgba(153, 102, 255, 1)',
            'rgba(255, 159, 64, 1)',
          ],
          borderWidth: 1
        }]
      },
      options: {
        scales: {
          y: {
            beginAtZero: true,
            
          },
          x: {
            display: true,
            title: {
              display: true,
              text: 'Noviembre',
              font: {
                size: 20
              },
              padding: {
                top: 10
              }
            }
          }
        }
      }
    });
  }
}