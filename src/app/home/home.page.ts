
import { Component, OnInit, computed, signal } from '@angular/core';
import {
  IonContent,
  IonFooter,
  IonSearchbar,
  IonChip,
  IonLabel,
  IonSpinner,
  IonIcon,
  NavController,
} from '@ionic/angular';

import { addIcons } from 'ionicons';
import { apertureOutline } from 'ionicons/icons';

import { PageHeaderComponent } from '../components/page-header/page-header.component';
import { BottomNavComponent } from '../components/bottom-nav/bottom-nav.component';
import { RecipeCardComponent } from '../components/recipe-card/recipe-card.component';
import { Recipe } from '../models/recipe';
import { RecipeService } from '../services/recipe.service';
import { RecentService } from '../services/recent.service';

const normalize = (type: string) => (type === 'Snack' ? 'Snacks' : type);

interface WheelSegment {
  recipe: Recipe;
  path: string;
  x: number;
  y: number;
  angle: number;
  label: string;
}

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
    IonIcon,
    PageHeaderComponent,
    BottomNavComponent,
    RecipeCardComponent,
  ],
})

export class HomePage implements OnInit {
  // Existing properties
  recipes = signal<Recipe[]>([]);
  isLoading = signal(true);
  errorMessage = signal('');

  searchText = signal('');
  selectedType = signal('All');

  // Spin the Wheel properties
  isWheelOpen = signal(false);
  isSpinning = signal(false);
  selectedWheelRecipe = signal<Recipe | null>(null);

  wheelRecipes = signal<Recipe[]>([]);
  wheelSegments = signal<WheelSegment[]>([]);

  wheelRotation = 0;

  private pendingWheelRecipe: Recipe | null = null;

  // Existing computed properties
  mealTypes = computed(() => {
    const types = new Set<string>();

    this.recipes().forEach((recipe) => {
      recipe.mealType.forEach((type) => types.add(normalize(type)));
    });

    return ['All', ...Array.from(types).sort()];
  });

  showSections = computed(
    () => this.searchText() === '' && this.selectedType() === 'All'
  );

  popularRecipes = computed(() =>
    [...this.recipes()]
      .sort((a, b) => b.rating - a.rating || b.reviewCount - a.reviewCount)
      .slice(0, 8)
  );

  recentRecipes = computed(() => this.recentService.recipes());

  filteredRecipes = computed(() => {
    const text = this.searchText().toLowerCase();
    const type = this.selectedType();

    return this.recipes().filter((recipe) => {
      const matchesType =
        type === 'All' || recipe.mealType.map(normalize).includes(type);

      const matchesText =
        recipe.name.toLowerCase().includes(text) ||
        recipe.cuisine.toLowerCase().includes(text) ||
        recipe.tags.some((tag) => tag.toLowerCase().includes(text));

      return matchesType && matchesText;
    });
  });

  constructor(
    private recipeService: RecipeService,
    private recentService: RecentService,
    private navCtrl: NavController,
  ) {
    addIcons({ apertureOutline });
  }

  ngOnInit() {
    this.recipeService.getRecipes().subscribe({
      next: (response) => {
        this.recipes.set(response.recipes);
        this.isLoading.set(false);
      },
      error: () => {
        this.errorMessage.set(
          'Failed to load recipes. Please check your internet connection.'
        );
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

  // SPIN THE WHEEL METHODS

  openWheel() {
    if (this.recipes().length === 0) return;

    const shuffled = [...this.recipes()];

    // Fisher-Yates shuffle
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }

    const randomRecipes = shuffled.slice(0, 10);

    this.wheelRecipes.set(randomRecipes);
    this.createWheelSegments(randomRecipes);

    this.wheelRotation = 0;
    this.selectedWheelRecipe.set(null);
    this.pendingWheelRecipe = null;
    this.isSpinning.set(false);

    this.isWheelOpen.set(true);
  }

  createWheelSegments(recipes: Recipe[]) {
    const center = 200;
    const radius = 190;
    const labelRadius = 125;
    const anglePerSegment = 360 / recipes.length;

    const segments = recipes.map((recipe, index) => {
      const startAngle = -90 + index * anglePerSegment;
      const endAngle = startAngle + anglePerSegment;
      const middleAngle = startAngle + anglePerSegment / 2;

      const start = this.getWheelPoint(center, radius, startAngle);
      const end = this.getWheelPoint(center, radius, endAngle);

      const path = [
        `M ${center} ${center}`,
        `L ${start.x} ${start.y}`,
        `A ${radius} ${radius} 0 0 1 ${end.x} ${end.y}`,
        'Z',
      ].join(' ');

      const labelPoint = this.getWheelPoint(
        center,
        labelRadius,
        middleAngle
      );

      return {
        recipe,
        path,
        x: labelPoint.x,
        y: labelPoint.y,
        angle: middleAngle,
        label:
          recipe.name.length > 19
            ? recipe.name.substring(0, 17) + '...'
            : recipe.name,
      };
    });

    this.wheelSegments.set(segments);
  }

  getWheelPoint(center: number, radius: number, angle: number) {
    const radians = (angle * Math.PI) / 180;

    return {
      x: center + radius * Math.cos(radians),
      y: center + radius * Math.sin(radians),
    };
  }

  spinWheel() {
    if (this.isSpinning() || this.wheelRecipes().length !== 10) {
      return;
    }

    const recipes = this.wheelRecipes();
    const winningIndex = Math.floor(Math.random() * recipes.length);

    this.pendingWheelRecipe = recipes[winningIndex];

    this.isSpinning.set(true);

    const anglePerSegment = 360 / recipes.length;
    const winningAngle =
      winningIndex * anglePerSegment + anglePerSegment / 2;

    const extraSpins = 5 * 360;
    const finalAngle = 360 - winningAngle;

    this.wheelRotation += extraSpins + finalAngle;
  }

  onWheelTransitionEnd() {
    if (!this.isSpinning()) return;

    this.isSpinning.set(false);
    this.selectedWheelRecipe.set(this.pendingWheelRecipe);

    this.pendingWheelRecipe = null;
  }

  closeWheel() {
    this.isWheelOpen.set(false);
    this.selectedWheelRecipe.set(null);
    this.isSpinning.set(false);
  }

  closeResult() {
    this.selectedWheelRecipe.set(null);
  }

  viewWheelRecipe() {
    const recipe = this.selectedWheelRecipe();

    if (recipe) {
      this.isWheelOpen.set(false);
      this.selectedWheelRecipe.set(null);

      this.navCtrl.navigateForward(`/recipes/${recipe.id}`);
    }
  }

}
