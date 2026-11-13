import { Component, OnInit, computed, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavController, IonContent, IonImg, IonSpinner, IonFab, IonFabButton, IonIcon } from '@ionic/angular';
import { addIcons } from 'ionicons';
import { arrowBack, heart, heartOutline, cartOutline, checkmarkCircle } from 'ionicons/icons';
import { Recipe } from '../models/recipe';
import { RecipeService } from '../services/recipe.service';
import { FavoritesService } from '../services/favorites.service';
import { RecentService } from '../services/recent.service';
import { ShoppingListService } from '../services/shopping-list.service';

@Component({
  selector: 'app-recipe-details',
  templateUrl: 'recipe-details.page.html',
  styleUrls: ['recipe-details.page.scss'],
  imports: [IonContent, IonImg, IonSpinner, IonFab, IonFabButton, IonIcon],
})
export class RecipeDetailsPage implements OnInit {
  recipe = signal<Recipe | null>(null);
  isLoading = signal(true);
  errorMessage = signal('');

  isFavorite = computed(() => {
    const recipe = this.recipe();
    return recipe ? this.favoritesService.isFavorite(recipe.id) : false;
  });

  inShoppingList = computed(() => {
    const recipe = this.recipe();
    return recipe ? this.shoppingList.hasRecipe(recipe.id) : false;
  });

  constructor(
    private route: ActivatedRoute,
    private recipeService: RecipeService,
    private favoritesService: FavoritesService,
    private recentService: RecentService,
    private shoppingList: ShoppingListService,
    private navCtrl: NavController,
  ) {
    addIcons({ arrowBack, heart, heartOutline, cartOutline, checkmarkCircle });
  }

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));

    this.recipeService.getRecipe(id).subscribe({
      next: (recipe) => {
        this.recipe.set(recipe);
        this.recentService.add(recipe);
        this.isLoading.set(false);
      },
      error: () => {
        this.errorMessage.set('Failed to load this recipe. Please try again.');
        this.isLoading.set(false);
      },
    });
  }

  toggleFavorite() {
    const recipe = this.recipe();
    if (recipe) {
      this.favoritesService.toggle(recipe);
    }
  }

  onShoppingButton() {
    const recipe = this.recipe();
    if (!recipe) {
      return;
    }
    if (this.inShoppingList()) {
      this.navCtrl.navigateRoot('/shopping-list');
    } else {
      this.shoppingList.addRecipe(recipe);
    }
  }

  goBack() {
    if (window.history.length > 1) {
      this.navCtrl.back();
    } else {
      this.navCtrl.navigateRoot('/home');
    }
  }
}
