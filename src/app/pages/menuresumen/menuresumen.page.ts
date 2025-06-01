import { Component, OnInit } from '@angular/core';
import { FirestoredatabaseService } from 'src/app/services/firestoredatabase.service';
import { AuthfirebaseService } from 'src/app/services/authfirebase.service';
import { UsuarioI } from 'src/app/models/modelos';
import { Chart } from 'chart.js';

@Component({
  selector: 'app-menuresumen',
  templateUrl: './menuresumen.page.html',
  styleUrls: ['./menuresumen.page.scss'],
})
export class MenuresumenPage implements OnInit {

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
      type: 'bar',
      data: {
        labels: ['Semana 1', 'Semana 2', 'Semana 3', 'Semana 4'],
        datasets: [{
          label: 'Cantidad de ordenes',
          data: [24, 30, 18, 36],
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
        labels: ['1','2','3','4','5','6','7','8','9','10','11','12','13','14','15','16','17','18','19','20','21','22','23','24','25','26','27','28','29','30'],
        datasets: [{
          label: 'Monto recaudado en CLP',
          data: [ 205000, 155000, 220000, 215000, 165000, 0, 240000, 325000, 260000, 265000, 315000, 275000, 0, 130000, 120000, 130000, 195000, 140000, 190000, 0, 325000, 265000, 260000, 315000, 275000, 315000, 0, 155000, 215000, 220000],
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
