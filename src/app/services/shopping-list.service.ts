import { Injectable, signal } from '@angular/core';
import { Recipe } from '../models/recipe';
import { ShoppingItem } from '../models/shopping-item';

const STORAGE_KEY = 'recipe-explorer-shopping-list';

@Injectable({ providedIn: 'root' })
export class ShoppingListService {
  items = signal<ShoppingItem[]>(this.load());

  hasRecipe(recipeId: number): boolean {
    return this.items().some((item) => item.recipeId === recipeId);
  }

  addRecipe(recipe: Recipe) {
    const existingIds = new Set(this.items().map((item) => item.id));
    const newItems: ShoppingItem[] = recipe.ingredients
      .map((name, index) => ({
        id: `${recipe.id}-${index}`,
        name,
        recipeId: recipe.id,
        recipeName: recipe.name,
        checked: false,
      }))
      .filter((item) => !existingIds.has(item.id));

    this.items.update((list) => [...list, ...newItems]);
    this.save();
  }

  toggle(id: string) {
    this.items.update((list) => list.map((item) => (item.id === id ? { ...item, checked: !item.checked } : item)));
    this.save();
  }

  removeRecipe(recipeId: number) {
    this.items.update((list) => list.filter((item) => item.recipeId !== recipeId));
    this.save();
  }

  clearChecked() {
    this.items.update((list) => list.filter((item) => !item.checked));
    this.save();
  }

  clearAll() {
    this.items.set([]);
    this.save();
  }

  private load(): ShoppingItem[] {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  }

  private save() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.items()));
    } catch {}
  }
}
