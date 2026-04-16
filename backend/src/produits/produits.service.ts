import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Produit } from './produit.entity';

@Injectable()
export class ProduitsService {
  constructor(
    @InjectRepository(Produit)
    private repo: Repository<Produit>,
  ) {}

  // Générer le numéro automatique PROD-0001
  async genererNumProduit(): Promise<string> {
    const dernier = await this.repo.find({
      order: { numProduit: 'DESC' },
      take: 1,
    });
    if (dernier.length === 0) return 'PROD-0001';
    const dernierNum = parseInt(dernier[0].numProduit.split('-')[1]);
    const nouveauNum = (dernierNum + 1).toString().padStart(4, '0');
    return `PROD-${nouveauNum}`;
  }

  // Ajouter
  // Nouveau produit (refuse si existe déjà)
  async create(dto: { design: string; prix: number; quantite: number }) {
    try {
      // Vérifie si le produit existe déjà (même nom ET même prix)
      const existant = await this.repo.findOne({
        where: {
          design: dto.design,
          prix: dto.prix,
        },
      });

      // Produit existe déjà → on refuse
      if (existant) {
        return {
          success: false,
          message: `Ce produit existe déjà (${existant.numProduit})`,
        };
      }

      // Produit n'existe pas on crée
      const numProduit = await this.genererNumProduit();
      const produit = this.repo.create({ numProduit, ...dto });
      await this.repo.save(produit);
      return {
        success: true,
        message: 'Insertion réussie',
        data: {
          ...produit,
          montant: Number(produit.prix) * produit.quantite,
        },
      };
    } catch {
      return { success: false, message: 'Insertion échouée' };
    }
  }

  // Augmenter la quantité produit
  async augmenterQuantite(numProduit: string, quantite: number) {
    try {
      const produit = await this.repo.findOne({ where: { numProduit } });
      if (!produit) return { success: false, message: 'Produit non trouvé' };

      produit.quantite = produit.quantite + quantite;
      await this.repo.save(produit);
      return {
        success: true,
        message: `Stock augmenté — nouveau stock : ${produit.quantite}`,
        data: { ...produit, montant: Number(produit.prix) * produit.quantite },
      };
    } catch {
      return { success: false, message: 'Augmentation échouée' };
    }
  }

  // Réduire la quantité produit
  async reduireQuantite(numProduit: string, quantite: number) {
    try {
      const produit = await this.repo.findOne({ where: { numProduit } });
      if (!produit) return { success: false, message: 'Produit non trouvé' };

      if (produit.quantite - quantite < 0) {
        return {
          success: false,
          message: `Stock insuffisant — stock actuel : ${produit.quantite}`,
        };
      }

      produit.quantite = produit.quantite - quantite;
      await this.repo.save(produit);
      return {
        success: true,
        message: `Stock réduit — nouveau stock : ${produit.quantite}`,
        data: { ...produit, montant: Number(produit.prix) * produit.quantite },
      };
    } catch {
      return { success: false, message: 'Réduction échouée' };
    }
  }

  // Lister tous
  // on liste les produits par ordre de date de modification mais on peut choisir de lister par ordre alphabetique de nom de produit
  async findAll(tri?: string) {
    try {
      let data: Produit[];

      if (tri === 'alpha') {
        // Tri alphabétique
        data = await this.repo
          .createQueryBuilder('p')
          .orderBy('LOWER(p.design)', 'ASC')
          .getMany();
      } else {
        // Dernière modification en haut
        data = await this.repo.find({
          order: { updatedAt: 'DESC' },
        });
      }

      const produits = data.map((p) => ({
        ...p,
        montant: Number(p.prix) * p.quantite,
      }));

      return { success: true, data: produits };
    } catch (e) {
      console.error(e);
      return { success: false, message: 'Chargement échoué' };
    }
  }

  // Trouver un seul
  async findOne(numProduit: string) {
    try {
      const data = await this.repo.findOne({ where: { numProduit } });
      if (!data) return { success: false, message: 'Produit non trouvé' };
      return {
        success: true,
        data: { ...data, montant: Number(data.prix) * data.quantite },
      };
    } catch {
      return { success: false, message: 'Produit non trouvé' };
    }
  }

  // Modifier produit
  async update(
    numProduit: string,
    dto: { design?: string; prix?: number; quantite?: number },
  ) {
    try {
      const produit = await this.repo.findOne({ where: { numProduit } });
      if (!produit) return { success: false, message: 'Produit non trouvé' };
      const updated = { ...produit, ...dto };
      await this.repo.save(updated);
      return { success: true, message: 'Modification réussie', data: updated };
    } catch {
      return { success: false, message: 'Modification échouée' };
    }
  }

  // Supprimer
  async remove(numProduit: string) {
    try {
      const produit = await this.repo.findOne({ where: { numProduit } });
      if (!produit) return { success: false, message: 'Produit non trouvé' };
      await this.repo.delete(numProduit);
      return { success: true, message: 'Suppression réussie' };
    } catch {
      return { success: false, message: 'Suppression échouée' };
    }
  }

  // Bilan
  async getBilan() {
    try {
      const produits = await this.repo.find();
      const montants = produits.map((p) => Number(p.prix) * p.quantite);
      return {
        success: true,
        data: {
          min: Math.min(...montants),
          max: Math.max(...montants),
          total: montants.reduce((a, b) => a + b, 0),
          produits: produits.map((p) => ({
            ...p,
            montant: Number(p.prix) * p.quantite,
          })),
        },
      };
    } catch {
      return { success: false, message: 'Bilan échoué' };
    }
  }

  // Recherche globale
  async search(query: string) {
    try {
      const data = await this.repo
        .createQueryBuilder('p')
        .where('LOWER(p.design) LIKE LOWER(:query)', { query: `%${query}%` })
        .orWhere('CAST(p.prix AS TEXT) LIKE :query', { query: `%${query}%` })
        .orWhere('LOWER(p.numProduit) LIKE LOWER(:query)', {
          query: `%${query}%`,
        })
        .orderBy('p.design', 'ASC')
        .getMany();

      const produits = data.map((p) => ({
        ...p,
        montant: Number(p.prix) * p.quantite,
      }));

      return { success: true, data: produits };
    } catch (e) {
      console.error(e);
      return { success: false, message: 'Recherche échouée' };
    }
  }
}
