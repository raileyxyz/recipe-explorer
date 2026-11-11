import { Component } from '@angular/core';
import { IonContent, IonFooter } from '@ionic/angular';
import { PageHeaderComponent } from '../components/page-header/page-header.component';
import { BottomNavComponent } from '../components/bottom-nav/bottom-nav.component';
import { RecipeCardComponent } from '../components/recipe-card/recipe-card.component';
import { FavoritesService } from '../services/favorites.service';

@Component({
  selector: 'app-favorites',
  templateUrl: 'favorites.page.html',
  styleUrls: ['favorites.page.scss'],
  imports: [IonContent, IonFooter, PageHeaderComponent, BottomNavComponent, RecipeCardComponent],
})
export class FavoritesPage {
  constructor(public favoritesService: FavoritesService) {}
}
