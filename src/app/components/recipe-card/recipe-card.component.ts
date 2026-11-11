import { Component, Input } from '@angular/core';
import { NavController, IonCard, IonImg } from '@ionic/angular';
import { Recipe } from '../../models/recipe';

@Component({
  selector: 'app-recipe-card',
  templateUrl: './recipe-card.component.html',
  styleUrls: ['./recipe-card.component.scss'],
  standalone: true,
  imports: [IonCard, IonImg],
})
export class RecipeCardComponent {
  @Input({ required: true }) recipe!: Recipe;

  constructor(private navCtrl: NavController) {}

  open() {
    this.navCtrl.navigateForward(['/recipes', this.recipe.id]);
  }
}
