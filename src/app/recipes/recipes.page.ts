import { Component, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import {
  IonContent,
  IonSearchbar,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardSubtitle,
  IonImg,
  IonSpinner,
} from '@ionic/angular';
import { PageHeaderComponent } from '../components/page-header/page-header.component';
import { Recipe } from '../models/recipe';
import { RecipeService } from '../services/recipe.service';

@Component({
  selector: 'app-recipes',
  templateUrl: 'recipes.page.html',
  styleUrls: ['recipes.page.scss'],
  imports: [
    IonContent,
    IonSearchbar,
    RouterLink,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardSubtitle,
    IonImg,
    IonSpinner,
    PageHeaderComponent,
  ],
})
export class RecipesPage implements OnInit {
  recipes = signal<Recipe[]>([]);
  isLoading = signal(true);
  errorMessage = signal('');

  constructor(private recipeService: RecipeService) {}

  ngOnInit() {
    this.loadRecipes();
  }

  onSearch(event: CustomEvent) {
    const query = (event.detail.value ?? '').trim();
    this.loadRecipes(query);
  }

  loadRecipes(query: string = '') {
    this.isLoading.set(true);
    this.errorMessage.set('');

    const request = query ? this.recipeService.searchRecipes(query) : this.recipeService.getRecipes();

    request.subscribe({
      next: (response) => {
        this.recipes.set(response.recipes);
        this.isLoading.set(false);
      },
      error: () => {
        this.errorMessage.set('Failed to load recipes. Please check your internet connection.');
        this.isLoading.set(false);
      },
    });
  }
}
