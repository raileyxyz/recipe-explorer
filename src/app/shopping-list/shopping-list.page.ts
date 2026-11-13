import { Component, computed } from '@angular/core';
import { IonContent, IonFooter, IonCheckbox } from '@ionic/angular';
import { PageHeaderComponent } from '../components/page-header/page-header.component';
import { BottomNavComponent } from '../components/bottom-nav/bottom-nav.component';
import { ShoppingItem } from '../models/shopping-item';
import { ShoppingListService } from '../services/shopping-list.service';

interface ShoppingGroup {
  recipeId: number;
  recipeName: string;
  items: ShoppingItem[];
}

@Component({
  selector: 'app-shopping-list',
  templateUrl: 'shopping-list.page.html',
  styleUrls: ['shopping-list.page.scss'],
  imports: [IonContent, IonFooter, IonCheckbox, PageHeaderComponent, BottomNavComponent],
})
export class ShoppingListPage {
  groups = computed(() => {
    const map = new Map<number, ShoppingGroup>();
    this.shopping.items().forEach((item) => {
      if (!map.has(item.recipeId)) {
        map.set(item.recipeId, { recipeId: item.recipeId, recipeName: item.recipeName, items: [] });
      }
      map.get(item.recipeId)!.items.push(item);
    });
    return Array.from(map.values());
  });

  checkedCount = computed(() => this.shopping.items().filter((item) => item.checked).length);

  constructor(public shopping: ShoppingListService) {}
}
