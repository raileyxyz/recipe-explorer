import { Component, OnInit, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IonContent, IonImg, IonSpinner, IonAccordionGroup, IonAccordion, IonItem, IonLabel } from '@ionic/angular';
import { PageHeaderComponent } from '../components/page-header/page-header.component';
import { Recipe } from '../models/recipe';
import { RecipeService } from '../services/recipe.service';

@Component({
  selector: 'app-recipe-details',
  templateUrl: 'recipe-details.page.html',
  styleUrls: ['recipe-details.page.scss'],
  imports: [IonContent, IonImg, IonSpinner, IonAccordionGroup, IonAccordion, IonItem, IonLabel, PageHeaderComponent],
})
export class RecipeDetailsPage implements OnInit {
  recipe = signal<Recipe | null>(null);
  isLoading = signal(true);
  errorMessage = signal('');

  constructor(
    private route: ActivatedRoute,
    private recipeService: RecipeService,
  ) {}

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
}
