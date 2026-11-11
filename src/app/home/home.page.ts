import { Component, OnInit, computed, signal } from '@angular/core';
import { IonContent, IonFooter, IonSearchbar, IonChip, IonLabel, IonSpinner } from '@ionic/angular';
import { PageHeaderComponent } from '../components/page-header/page-header.component';
import { BottomNavComponent } from '../components/bottom-nav/bottom-nav.component';
import { RecipeCardComponent } from '../components/recipe-card/recipe-card.component';
import { Recipe } from '../models/recipe';
import { RecipeService } from '../services/recipe.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  imports: [
    IonContent,
    IonFooter,
    IonSearchbar,
    IonChip,
    IonLabel,
    IonSpinner,
    PageHeaderComponent,
    BottomNavComponent,
    RecipeCardComponent,
  ],
})
export class HomePage implements OnInit {
  recipes = signal<Recipe[]>([]);
  isLoading = signal(true);
  errorMessage = signal('');

  searchText = signal('');
  selectedType = signal('All');

  mealTypes = computed(() => {
    const types = new Set<string>();
    this.recipes().forEach((recipe) => {
      recipe.mealType.forEach((type) => types.add(type));
    });
    return ['All', ...Array.from(types).sort()];
  });

  filteredRecipes = computed(() => {
    const text = this.searchText().toLowerCase();
    const type = this.selectedType();

    return this.recipes().filter((recipe) => {
      const matchesType = type === 'All' || recipe.mealType.includes(type);
      const matchesText =
        recipe.name.toLowerCase().includes(text) ||
        recipe.cuisine.toLowerCase().includes(text) ||
        recipe.tags.some((tag) => tag.toLowerCase().includes(text));
      return matchesType && matchesText;
    });
  });

  constructor(private recipeService: RecipeService) {}

  ngOnInit() {
    this.recipeService.getRecipes().subscribe({
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

  onSearch(event: CustomEvent) {
    this.searchText.set((event.detail.value ?? '').trim());
  }

  selectType(type: string) {
    this.selectedType.set(type);
  }
}
