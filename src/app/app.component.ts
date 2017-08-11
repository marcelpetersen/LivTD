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
import { WelcomePage } from '../pages/welcome/welcome';
import { ValetPage } from '../pages/valet/valet';

import { Events } from 'ionic-angular';
import { CameraProvider } from '../providers/camera';
import { FirebaseProvider } from '../providers/firebaseProvider';
import { AlertProvider } from '../providers/alert';
import { InAppBrowserProvider } from '../providers/inAppBrowserProvider';
import { StorageProvider } from '../providers/storage';



@Component({
  templateUrl: 'app.html'
})
export class MyApp {

  @ViewChild(Nav) nav: Nav;

  rootPage : any;
  userName : string;
  userPhotoURL: string;
  pages : Array<{title: string, component: any, icon: string}>;
  
  constructor(public platform: Platform, public statusBar: StatusBar, public splashScreen: SplashScreen, public events: Events, public cameraProvider: CameraProvider
    , public firebaseProvider: FirebaseProvider, public browser : InAppBrowserProvider, public alertProvider : AlertProvider,    public storageProvider: StorageProvider) {
    
    this.initializeApp(); 
    this.userPhotoURL = '../assets/default.png'
  
    this.storageProvider.getItem('curent_user').then(data => {
      if (data) {
        this.userName = data.displayName;
        this.userPhotoURL = data.photoURL;
        this.rootPage = HomePage;
      } else {
        this.storageProvider.getItem('livapp_init_complete')
          .then((data) => {
            if (data) {
              this.rootPage = LoginPage
            }
            else {
              this.rootPage = WelcomePage
              this.storageProvider.setItem('livapp_init_complete', true);
            }
          })
      }
    })

    this.userName = "";
    this.userPhotoURL = "";
    // used for an example of ngFor and navigation
    this.pages = [
      { title: 'Home', component: HomePage, icon: 'ios-home-outline' },
      { title: 'Upcoming Events', component: UpcomingEventsPage ,icon: "ios-calendar-outline"},
      { title: 'Buy Tickets', component: BuyTicketsPage, icon: 'ios-barcode-outline' },
      { title: 'Book a Table', component: BookTablePage, icon: 'ios-people' },
      { title: 'Fun', component: FunPage, icon: 'ios-heart-outline' },
      { title: 'Valet', component: ValetPage, icon: 'md-car' },
      { title: 'Latest News', component: LatestNewsPage, icon: 'ios-redo' },
      { title: 'Photos', component: PhotosPage, icon: 'ios-images-outline' },
      { title: 'LIV TV', component: LivTVPage, icon: 'logo-youtube' },
      { title: 'Shop', component: ShopPage, icon: 'ios-basket' },
      { title: 'Hotel Reservations', component: HotelReservationsPage, icon: 'ios-alarm-outline' },
      { title: 'About', component: AboutPage, icon: 'ios-information-circle' },
      { title: 'My Profile', component: MyProfilePage, icon: 'ios-person' }
    ];

    events.subscribe('user:changed', (name, photoURL) => {
      this.userName = name;
      this.userPhotoURL = photoURL;
      this.alertProvider.dismissLoadingCustom();  
    }); 

    events.subscribe('sideMenu:changedPhoto', (imageData) => {     
        this.alertProvider.presentLoadingCustom();
        this.firebaseProvider.uploadUserPhoto(imageData);     
    });

  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleLightContent();
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
        this.browser.openURL('https://www.tixr.com/groups/story ');
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

  openMyProfilePage(){
    this.nav.setRoot(MyProfilePage);
  }

  onChengePhotoClick(){
    let alert = this.cameraProvider.showChoiceAlert(CameraProvider.TO_SIDE_MENU);
    alert.present();
  }
}
