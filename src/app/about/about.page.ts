import { Component } from '@angular/core';
import { IonContent, IonFooter } from '@ionic/angular';
import { PageHeaderComponent } from '../components/page-header/page-header.component';
import { BottomNavComponent } from '../components/bottom-nav/bottom-nav.component';

interface Member {
  name: string;
  role: string;
  contribution: string;
  photo?: string;
}

@Component({
  selector: 'app-about',
  templateUrl: 'about.page.html',
  styleUrls: ['about.page.scss'],
  imports: [IonContent, IonFooter, PageHeaderComponent, BottomNavComponent],
})
export class AboutPage {
  projectTitle = 'Recipe Explorer';
  projectDescription =
    'A hybrid mobile app built with Ionic and Angular. It shows recipes from a public API, lets users search and filter them by meal type, view the ingredients and directions, and save their favorites.';

  course = 'BSIT';
  yearSection = '3F';
  subject = 'Mobile Application Development – Final Case Study';

  members: Member[] = [
    {
      name: 'John Railey R. Mauro',
      photo: 'assets/members/rai.png',
      role: 'Lead Developer',
      contribution: 'Built the recipe list, the API service, and the routing.',
    },
    {
      name: 'Jamie Anne A. Banjola',
      photo: 'assets/members/jam.png',
      role: 'UI/UX Designer',
      contribution: 'Designed the Home and Recipe Details screens and the app theme.',
    },
    {
      name: 'Mikey Kevin A. Marcelo',
      photo: 'assets/members/mike.png',
      role: 'Component Developer and Tester',
      contribution: 'Built the About page and reusable components, and tested the main user flow.',
    },
    {
      name: 'Miguelito A. Fajardo',
      photo: 'assets/members/migs.png',
      role: 'Documentation and Build',
      contribution: 'Built the Android APK, took screenshots, and wrote the documentation.',
    },
  ];

  tools = ['Ionic', 'Angular', 'TypeScript', 'DummyJSON Recipes API'];
}
