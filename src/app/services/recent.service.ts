import { Injectable, signal } from '@angular/core';
import { Recipe } from '../models/recipe';

const STORAGE_KEY = 'recipe-explorer-recent';
const MAX_ITEMS = 6;

@Injectable({ providedIn: 'root' })
export class RecentService {
  recipes = signal<Recipe[]>(this.load());

  add(recipe: Recipe) {
    this.recipes.update((list) => [recipe, ...list.filter((item) => item.id !== recipe.id)].slice(0, MAX_ITEMS));
    this.save();
  }

  private load(): Recipe[] {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  }

  private save() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.recipes()));
    } catch {}
  }
}
