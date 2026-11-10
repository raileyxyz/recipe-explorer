import { Component, OnInit, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavController, IonContent, IonImg, IonSpinner, IonFab, IonFabButton, IonIcon } from '@ionic/angular';
import { addIcons } from 'ionicons';
import { arrowBack } from 'ionicons/icons';
import { Recipe } from '../models/recipe';
import { RecipeService } from '../services/recipe.service';

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

  constructor(
    private route: ActivatedRoute,
    private recipeService: RecipeService,
    private navCtrl: NavController,
  ) {
    addIcons({ arrowBack });
  }

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));

    this.recipeService.getRecipe(id).subscribe({
      next: (recipe) => {
        this.recipe.set(recipe);
        this.isLoading.set(false);
      },
      error: () => {
        this.errorMessage.set('Failed to load this recipe. Please try again.');
        this.isLoading.set(false);
      },
    });
  }

  goBack() {
    this.navCtrl.navigateBack('/home');
  }
}
