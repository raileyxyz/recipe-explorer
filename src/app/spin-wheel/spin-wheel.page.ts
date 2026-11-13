import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavController, IonContent, IonImg, IonSpinner } from '@ionic/angular';
import { Recipe } from '../models/recipe';
import { RecipeService } from '../services/recipe.service';

interface WheelSegment {
  recipe: Recipe;
  path: string;
  x: number;
  y: number;
  angle: number;
  label: string;
}

@Component({
  selector: 'app-spin-wheel',
  templateUrl: './spin-wheel.page.html',
  styleUrls: ['./spin-wheel.page.scss'],
  imports: [CommonModule, IonContent, IonImg, IonSpinner],
})
export class SpinWheelPage {
  recipes = signal<Recipe[]>([]);
  segments = signal<WheelSegment[]>([]);
  selectedRecipe = signal<Recipe | null>(null);

  isLoading = signal(true);
  isSpinning = signal(false);
  errorMessage = signal('');

  wheelRotation = 0;
  private pendingRecipe: Recipe | null = null;

  constructor(
    private recipeService: RecipeService,
    private navCtrl: NavController,
  ) {}

ionViewWillEnter() {
  this.loadRandomRecipes();
}

  // Fetch all recipes and randomly select 10
  loadRandomRecipes() {
    this.isLoading.set(true);
    this.errorMessage.set('');

    this.recipeService.getRecipes().subscribe({
      next: (response) => {
        const shuffled = [...response.recipes]
          .sort(() => Math.random() - 0.5);

        const randomRecipes = shuffled.slice(0, 10);

        this.recipes.set(randomRecipes);
        this.createWheelSegments(randomRecipes);

        this.wheelRotation = 0;
        this.isLoading.set(false);
      },
      error: () => {
        this.errorMessage.set(
          'Unable to load recipes. Please try again.',
        );
        this.isLoading.set(false);
      },
    });
  }

  // Create the 10 sections of the wheel
  createWheelSegments(recipes: Recipe[]) {
    const center = 200;
    const radius = 190;
    const labelRadius = 125;
    const anglePerSegment = 360 / recipes.length;

    const wheelSegments = recipes.map((recipe, index) => {
      const startAngle = -90 + index * anglePerSegment;
      const endAngle = startAngle + anglePerSegment;
      const middleAngle = startAngle + anglePerSegment / 2;

      const start = this.getPoint(center, radius, startAngle);
      const end = this.getPoint(center, radius, endAngle);

      const path = [
        `M ${center} ${center}`,
        `L ${start.x} ${start.y}`,
        `A ${radius} ${radius} 0 0 1 ${end.x} ${end.y}`,
        'Z',
      ].join(' ');

      const labelPoint = this.getPoint(
        center,
        labelRadius,
        middleAngle,
      );

      return {
        recipe,
        path,
        x: labelPoint.x,
        y: labelPoint.y,
        angle: middleAngle,
        label: this.shortenName(recipe.name),
      };
    });

    this.segments.set(wheelSegments);
  }

  // Calculate the position of each wheel point
  getPoint(center: number, radius: number, angle: number) {
    const radians = (angle * Math.PI) / 180;

    return {
      x: center + radius * Math.cos(radians),
      y: center + radius * Math.sin(radians),
    };
  }

  // Keep long recipe names readable
  shortenName(name: string): string {
    return name.length > 19
      ? name.substring(0, 17) + '...'
      : name;
  }

  // Spin the wheel and randomly choose a winner
  spinWheel() {
    if (this.isSpinning() || this.recipes().length !== 10) {
      return;
    }

    const recipes = this.recipes();
    const winningIndex = Math.floor(Math.random() * recipes.length);

    this.pendingRecipe = recipes[winningIndex];
    this.isSpinning.set(true);

    const anglePerSegment = 360 / recipes.length;
    const winningAngle = winningIndex * anglePerSegment + anglePerSegment / 2;

    const extraSpins = 5 * 360;
    const finalAngle = 360 - winningAngle;

    this.wheelRotation += extraSpins + finalAngle;

  }

  // Called when the wheel animation finishes
  onWheelTransitionEnd() {
    if (!this.isSpinning()) {
      return;
    }

    this.isSpinning.set(false);
    this.selectedRecipe.set(this.pendingRecipe);
    this.pendingRecipe = null;
  }

  // Navigate to the existing recipe details page
  viewRecipe() {
    const recipe = this.selectedRecipe();

    if (recipe) {
      this.navCtrl.navigateForward(`/recipes/${recipe.id}`);
    }
  }

  // Close the Spin the Wheel page
  closePage() {
    this.navCtrl.navigateBack('/home');
  }

  // Close the result popup
  closeResult() {
    this.selectedRecipe.set(null);
  }

  // Try loading recipes again
  retry() {
    this.loadRandomRecipes();
  }
}