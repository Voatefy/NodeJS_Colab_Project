import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProduitsService } from './produits.service';
import { ProduitsController } from './produits.controller';
import { Produit } from './produit.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Produit])],
  providers: [ProduitsService],
  controllers: [ProduitsController],
})
export class ProduitsModule {}
