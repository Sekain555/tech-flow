import { Component, OnInit} from '@angular/core';
import { NavController } from '@ionic/angular';
import { Chart } from 'chart.js';

@Component({
  selector: 'app-estadisticasorden',
  templateUrl: './estadisticasorden.page.html',
  styleUrls: ['./estadisticasorden.page.scss'],
})
export class EstadisticasordenPage implements OnInit {

fechita: any;

  constructor(private navCtrl: NavController) { }

  ngOnInit() {
    this.presentarGrafico1();
    this.presentarGrafico2();
    this.presentarGrafico3();
    this.presentarGrafico4();
  }

  //'Ingresado', 'En reparación', 'Esperando repuesto', 'Reparado', 'Sin reparación'
  presentarGrafico1() {
    const canvas = document.getElementById('edrChart');
    const ctx = (canvas as HTMLCanvasElement).getContext('2d');
    const edrChart = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: ['Ingresado', 'En reparación', 'Esperando repuesto', 'Reparado', 'Sin reparación'],
        datasets: [{
          label: 'Cantidad de ordenes',
          data: [12, 19, 3, 5, 2],
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
            beginAtZero: true
          }
        }
      }
    });
  }

  presentarGrafico2() {
    const canvas = document.getElementById('odtChart');
    const ctx = (canvas as HTMLCanvasElement).getContext('2d');
    const odtChart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['Hoy'],
        datasets: [{
          label: 'Cantidad de ordenes',
          data: [12, 19, 3, 5, 2, 3],
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
            beginAtZero: true
          }
        }
      }
    });
  }

  presentarGrafico3() {
    const canvas = document.getElementById('codtChart');
    const ctx = (canvas as HTMLCanvasElement).getContext('2d');
    const codtChart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: ['Hoy'],
        datasets: [{
          label: '# of votes',
          data: [12],
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
            beginAtZero: true
          }
        }
      }
    });
  }

  presentarGrafico4() {
    const canvas = document.getElementById('tdrChart');
    const ctx = (canvas as HTMLCanvasElement).getContext('2d');
    const tdrChart = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: ['Revisión', 'Reparación', 'Mantención', 'Garantía'],
        datasets: [{
          label: 'Cantidad de ordenes',
          data: [12, 19, 3, 5],
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
            beginAtZero: true
          }
        }
      }
    });
  }
}