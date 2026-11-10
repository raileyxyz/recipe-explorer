import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Recipe, RecipesResponse } from '../models/recipe';

@Injectable({ providedIn: 'root' })
export class RecipeService {
  private readonly apiUrl = 'https://dummyjson.com/recipes';

  constructor(private http: HttpClient) {}

  // get the 20 recipe
  getRecipes(): Observable<RecipesResponse> {
    return this.http.get<RecipesResponse>(`${this.apiUrl}?limit=20`);
  }

  // search recipe through api
  searchRecipes(query: string): Observable<RecipesResponse> {
    return this.http.get<RecipesResponse>(`${this.apiUrl}/search`, {
      params: { q: query },
    });
  }

  getRecipe(id: number): Observable<Recipe> {
    return this.http.get<Recipe>(`${this.apiUrl}/${id}`);
  }
}
