import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-bilan',
  imports: [CommonModule],
  templateUrl: './bilan.html',
  styleUrl: './bilan.css'
})
export class Bilan implements OnInit {

  min = 0;
  max = 0;
  total = 0;
  produits: any[] = [];
  message = '';

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
            this.min = res.data.min;
            this.max = res.data.max;
            this.total = res.data.total;
            this.produits = res.data.produits;
          }
        },
        error: (err) => {
          this.message = 'Erreur de connexion au serveur';
        }
      });
  }
}