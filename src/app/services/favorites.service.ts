import { Injectable, signal } from '@angular/core';
import { Recipe } from '../models/recipe';

const STORAGE_KEY = 'recipe-explorer-favorites';

@Injectable({ providedIn: 'root' })
export class FavoritesService {
  favorites = signal<Recipe[]>(this.load());

  isFavorite(id: number): boolean {
    return this.favorites().some((recipe) => recipe.id === id);
  }

  toggle(recipe: Recipe) {
    if (this.isFavorite(recipe.id)) {
      this.favorites.update((list) => list.filter((item) => item.id !== recipe.id));
    } else {
      this.favorites.update((list) => [...list, recipe]);
    }
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
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.favorites()));
    } catch {}
  }
}
