import { Component, Input } from '@angular/core';
import { NavController, IonIcon } from '@ionic/angular';
import { addIcons } from 'ionicons';
import { home, homeOutline, heart, heartOutline, informationCircle, informationCircleOutline } from 'ionicons/icons';

interface NavItem {
  key: string;
  label: string;
  route: string;
  icon: string;
  iconActive: string;
  ready: boolean;
}

@Component({
  selector: 'app-bottom-nav',
  templateUrl: './bottom-nav.component.html',
  styleUrls: ['./bottom-nav.component.scss'],
  standalone: true,
  imports: [IonIcon],
})
export class BottomNavComponent {
  @Input() active: string = 'home';

  items: NavItem[] = [
    { key: 'home', label: 'Home', route: '/home', icon: 'home-outline', iconActive: 'home', ready: true },
    {
      key: 'favorites',
      label: 'Favorites',
      route: '/favorites',
      icon: 'heart-outline',
      iconActive: 'heart',
      ready: true,
    },
    {
      key: 'about',
      label: 'About',
      route: '/about',
      icon: 'information-circle-outline',
      iconActive: 'information-circle',
      ready: true,
    },
  ];

  constructor(private navCtrl: NavController) {
    addIcons({ home, homeOutline, heart, heartOutline, informationCircle, informationCircleOutline });
  }

  go(item: NavItem) {
    if (!item.ready || item.key === this.active) {
      return;
    }
    this.navCtrl.navigateRoot(item.route);
  }
}
