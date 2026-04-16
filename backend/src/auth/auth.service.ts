import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { User } from './user.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private repo: Repository<User>,
    private jwtService: JwtService,
  ) {}

  // Inscription
  async register(email: string, password: string) {
    try {
      // Vérifie si l'email existe déjà
      const existant = await this.repo.findOne({ where: { email } });
      if (existant) {
        return { success: false, message: 'Cet email existe déjà' };
      }

      // Chiffre le mot de passe
      const hash = await bcrypt.hash(password, 10);

      // Sauvegarde l'utilisateur
      const user = this.repo.create({ email, password: hash });
      await this.repo.save(user);

      return { success: true, message: 'Inscription réussie' };
    } catch {
      return { success: false, message: 'Inscription échouée' };
    }
  }

  // Connexion
  async login(email: string, password: string) {
    try {
      // Cherche l'utilisateur
      const user = await this.repo.findOne({ where: { email } });
      if (!user) {
        return { success: false, message: 'Email ou mot de passe incorrect' };
      }

      // Vérifie le mot de passe
      const isValid = await bcrypt.compare(password, user.password);
      if (!isValid) {
        return { success: false, message: 'Email ou mot de passe incorrect' };
      }

      // Génère le token JWT
      const token = this.jwtService.sign({
        email: user.email,
        sub: user.id,
      });

      return {
        success: true,
        message: 'Connexion réussie',
        access_token: token,
      };
    } catch {
      return { success: false, message: 'Connexion échouée' };
    }
  }
}
