import { Component, ViewChild } from '@angular/core';
import { Nav, Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { HomePage } from '../pages/home/home';
import {AboutPage} from '../pages/about/about';
import {BookTablePage} from '../pages/bookTable/bookTable';
import {BuyTicketsPage} from '../pages/buyTickets/buyTickets';
import {ContactPage} from '../pages/contact/contact';
import {FunPage} from '../pages/fun/fun';
import {HotelReservationsPage} from '../pages/hotelReservations/hotelReservations'
import {LatestNewsPage} from '../pages/latestNews/latestNews'
import {LivTVPage} from '../pages/livTV/livTV';
import {PhotosPage} from '../pages/photos/photos';
import {ShopPage} from '../pages/shop/shop';
import {UpcomingEventsPage} from '../pages/upcomingEvents/upcomingEvents';
import {LoginPage} from '../pages/auth/login/login';
import {MyProfilePage} from '../pages/myProfile/myProfile';

import { Events } from 'ionic-angular';
import { CameraProvider } from '../providers/camera';
import { FirebaseProvider } from '../providers/firebaseProvider';

import { InAppBrowserProvider } from '../providers/inAppBrowserProvider'


@Component({
  templateUrl: 'app.html'
})
export class MyApp {

  @ViewChild(Nav) nav: Nav;

  rootPage : any = LoginPage;
  userName : string;
  userPhotoURL : string;
  pages : Array<{title: string, component: any, icon: string}>;
  
 

  constructor(public platform: Platform, public statusBar: StatusBar, public splashScreen: SplashScreen, public events: Events, 
    public cameraProvider: CameraProvider, public firebaseProvider: FirebaseProvider, public browser : InAppBrowserProvider) {
    
    this.initializeApp();   
    this.userName = "";
    this.userPhotoURL = "";
    // used for an example of ngFor and navigation
    this.pages = [
      { title: 'Home', component: HomePage, icon: 'ios-home-outline' },
      { title: 'Upcoming Events', component: UpcomingEventsPage ,icon: "ios-calendar-outline"},
      { title: 'Buy Tickets', component: BuyTicketsPage, icon: 'ios-barcode-outline' },
      { title: 'Book a Table', component: BookTablePage, icon: 'md-wine' },
      // { title: 'Fun', component: FunPage, icon: 'ios-heart-outline' },
      { title: 'Latest News', component: LatestNewsPage, icon: 'ios-redo' },
      { title: 'Photos', component: PhotosPage, icon: 'ios-images-outline' },
      { title: 'LIV TV', component: LivTVPage, icon: 'ios-videocam-outline' },
      { title: 'Shop', component: ShopPage, icon: 'md-basket' },
      { title: 'Hotel Reservations', component: HotelReservationsPage, icon: 'ios-alarm-outline' },
      // { title: 'Contact', component: ContactPage, icon: 'ios-call' },
      { title: 'About', component: AboutPage, icon: 'ios-information-circle' },
      { title: 'My Profile', component: MyProfilePage, icon: 'ios-person' }
    ];
    /*const unsubscribe = firebase.auth().onAuthStateChanged((user) => {
      if (!user) {
        this.rootPage = LoginPage;
        unsubscribe();
      } else { 
        this.rootPage = HomePage;
        unsubscribe();
      }
    });*/
    events.subscribe('user:changed', (name, photoURL) => {
      this.userName = name;
      this.userPhotoURL = photoURL;
    }); 

    events.subscribe('changedPhoto', (imageData, toUpload:boolean) => {
      if (toUpload)
        this.firebaseProvider.uploadPhoto(imageData);
    }); 
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }

  openPage(page) {
   switch (page.title) {
    case 'Latest News':
       this.browser.openURL('https://www.livnightclub.com/');
       break;    
    case 'Upcoming Events':
       this.browser.openURL('https://www.tixr.com/groups/liv');
        break;
    case 'Buy Tickets':
       this.browser.openURL('https://www.tixr.com/groups/liv');
        break;
    case 'Shop':
       this.browser.openURL('https://www.shopLIVmiami.com/');
        break;        
    case 'Hotel Reservations':
       this.browser.openURL('https://www.fontainebleau.com/');
        break;

    default:
      this.nav.setRoot(page.component);
      break;
   }
   
  }

   //refactor this function
  openMyProfilePage(){
    this.nav.setRoot(MyProfilePage);
  }

  onChengePhotoClick(){
    this.cameraProvider.showChoiceAlert(true);
  }
}
