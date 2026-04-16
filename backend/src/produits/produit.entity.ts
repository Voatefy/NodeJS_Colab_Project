import { Entity, PrimaryColumn, Column, UpdateDateColumn } from 'typeorm';

@Entity()
export class Produit {
  @PrimaryColumn()
  numProduit: string;

  @Column()
  design: string;

  @Column('decimal', { precision: 10, scale: 2 })
  prix: number;

  @Column()
  quantite: number;

  @UpdateDateColumn()
  updatedAt: Date; // ici on en registre la date de mdofication pour afficher en plus haut la derniere modification
}
