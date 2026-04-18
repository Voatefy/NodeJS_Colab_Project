import { Component, OnInit, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

@Component({
  selector: 'app-bilan',
  imports: [CommonModule],
  templateUrl: './bilan.html',
  styleUrl: './bilan.css'
})
export class Bilan implements OnInit {

  min = signal(0);
  max = signal(0);
  total = signal(0);
  produits: any[] = [];
  message = signal('');


  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.getBilan();
  }

  getBilan() {
    const token = localStorage.getItem('token');
    
    const headers = { Authorization: `Bearer ${token}` };

    this.http.get<any>('http://localhost:3000/produits/bilan', { headers })
      .subscribe({
        next: (res) => {
          if (res.success) {
            this.min.set(Number(res.data.min));
            this.max.set(Number(res.data.max));
            this.total.set(Number(res.data.total));
            this.produits = res.data.produits;
            this.creerGraphiques();
          }
        },
        error: (err) => {
          this.message.set('Erreur de connexion au serveur');
        }
      });
  }

  creerGraphiques() {
    const labels = this.produits.map(p => p.design);
    const montants = this.produits.map(p => p.montant);

    // Détruire les anciens graphiques s'ils existent
    const histoExistant = Chart.getChart('histogramme');
    if (histoExistant) histoExistant.destroy();

    const camembertExistant = Chart.getChart('camembert');
    if (camembertExistant) camembertExistant.destroy();

    // Histogramme
    new Chart('histogramme', {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [{
          label: 'Montant (Ar)',
          data: montants,
          backgroundColor: '#3498db'
        }]
      }
    });

    // Camembert
    new Chart('camembert', {
      type: 'pie',
      data: {
        labels: labels,
        datasets: [{
          data: montants,
          backgroundColor: [
            '#3498db', '#e74c3c', '#2ecc71',
            '#f39c12', '#9b59b6', '#1abc9c'
          ]
        }]
      }
    });
  }
}