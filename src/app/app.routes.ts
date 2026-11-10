import type { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'home',
    loadComponent: () => import('./home/home.page').then((m) => m.HomePage),
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  {
    path: 'recipes',
    loadComponent: () => import('./recipes/recipes.page').then((m) => m.RecipesPage),
  },
  {
    path: 'recipe-details',
    loadComponent: () => import('./recipe-details/recipe-details.page').then((m) => m.RecipeDetailsPage),
  },
  {
    path: 'recipes/:id',
    loadComponent: () => import('./recipe-details/recipe-details.page').then((m) => m.RecipeDetailsPage),
  },
];
