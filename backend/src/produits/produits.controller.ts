import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Patch,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ProduitsService } from './produits.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard) // protège TOUTES les routes
@Controller('produits')
export class ProduitsController {
  constructor(private readonly produitsService: ProduitsService) {}

  // Nouveau produit
  @Post()
  create(@Body() body: { design: string; prix: number; quantite: number }) {
    return this.produitsService.create(body);
  }

  // Lister tous
  @Get()
  findAll(@Query('tri') tri?: string) {
    return this.produitsService.findAll(tri);
  }

  // Bilan
  @Get('bilan')
  getBilan() {
    return this.produitsService.getBilan();
  }

  // Recherche globale
  @Get('search')
  search(@Query('q') q: string) {
    return this.produitsService.search(q);
  }

  // Augmenter quantité
  @Patch(':numProduit/augmenter')
  augmenterQuantite(
    @Param('numProduit') numProduit: string,
    @Body() body: { quantite: number },
  ) {
    return this.produitsService.augmenterQuantite(numProduit, body.quantite);
  }

  // Réduire quantité
  @Patch(':numProduit/reduire')
  reduireQuantite(
    @Param('numProduit') numProduit: string,
    @Body() body: { quantite: number },
  ) {
    return this.produitsService.reduireQuantite(numProduit, body.quantite);
  }

  // Trouver un produit
  @Get(':numProduit')
  findOne(@Param('numProduit') numProduit: string) {
    return this.produitsService.findOne(numProduit);
  }

  // Modifier un produit
  @Put(':numProduit')
  update(
    @Param('numProduit') numProduit: string,
    @Body() body: { design?: string; prix?: number; quantite?: number },
  ) {
    return this.produitsService.update(numProduit, body);
  }

  // Supprimer un produit
  @Delete(':numProduit')
  remove(@Param('numProduit') numProduit: string) {
    return this.produitsService.remove(numProduit);
  }
}
