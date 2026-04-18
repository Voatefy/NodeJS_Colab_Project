import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  imports: [FormsModule, CommonModule],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {

  email = '';
  password = '';
  message = '';

  constructor(private http: HttpClient, private router: Router) {}

  seConnecter() {   
    this.http.post<any>('http://localhost:3000/auth/login', {
      email: this.email,
      password: this.password
    }).subscribe({
      next: (res) => {
        if (res.success) {
          localStorage.setItem('token', res.access_token);
          this.router.navigate(['/bilan']);
        } else {
          this.message = res.message;
        }
      },
      error: (err) => {
        this.message = 'Erreur de connexion au serveur';
      }
    });
  }
}