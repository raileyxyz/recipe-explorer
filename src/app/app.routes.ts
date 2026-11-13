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
    path: 'recipe-details',
    loadComponent: () => import('./recipe-details/recipe-details.page').then((m) => m.RecipeDetailsPage),
  },
  {
    path: 'recipes/:id',
    loadComponent: () => import('./recipe-details/recipe-details.page').then((m) => m.RecipeDetailsPage),
  },
  {
    path: 'favorites',
    loadComponent: () => import('./favorites/favorites.page').then((m) => m.FavoritesPage),
  },
  {
    path: 'about',
    loadComponent: () => import('./about/about.page').then((m) => m.AboutPage),
  },
  {
    path: 'shopping-list',
    loadComponent: () => import('./shopping-list/shopping-list.page').then((m) => m.ShoppingListPage),
  },
  {
    path: 'spin-wheel',
    loadComponent: () => import('./spin-wheel/spin-wheel.page').then((m) => m.SpinWheelPage),
  },
  {
    path: 'spin-wheel',
    loadComponent: () =>
      import('./spin-wheel/spin-wheel.page').then((m) => m.SpinWheelPage),
  },
];
