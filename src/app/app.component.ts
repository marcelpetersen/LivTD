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
import { LightShowPage } from '../pages/lightShow/lightShow';

import { Events } from 'ionic-angular';
import { CameraProvider } from '../providers/camera';
import { FirebaseProvider } from '../providers/firebaseProvider';
import { AlertProvider } from '../providers/alert';
import { InAppBrowserProvider } from '../providers/inAppBrowserProvider';
import { StorageProvider } from '../providers/storage';
import { Push, PushObject, PushOptions } from '@ionic-native/push';



@Component({
  templateUrl: 'app.html'
})
export class MyApp {

  @ViewChild(Nav) nav: Nav;

  rootPage : any;
  userName : string;
  userPhotoURL: string;
  pages : Array<{title: string, component: any, icon: string}>;
  pushObject: PushObject;
  
  constructor(public platform: Platform, public statusBar: StatusBar, public splashScreen: SplashScreen, public events: Events, public cameraProvider: CameraProvider
    , public firebaseProvider: FirebaseProvider, public browser: InAppBrowserProvider, public alertProvider: AlertProvider, public storageProvider: StorageProvider, public push: Push) {
    
    this.initializeApp(); 
   
    this.userPhotoURL = '../assets/default.png'
  


      this.storageProvider.getItem('curent_user').then(data => {
        if (data) {
          let refer = this.firebaseProvider.getUserRef(data.id)
          refer.once('value', snapshot => {     
            if (snapshot.val()) {

              this.userName = data.displayName;
              this.userPhotoURL = data.photoURL;
              this.rootPage = HomePage;
              this.platform.ready().then(() => {
                this.pushSetup();
              })
            } else this.checkForFirstLaunch();
          })
         
        } else {
          this.checkForFirstLaunch();
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
      { title: 'Light Show', component: LightShowPage, icon: 'ios-flash' },
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
      this.platform.ready().then(() => {
        this.pushSetup();
      })  
    }); 

  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.overlaysWebView(false);
      this.statusBar.styleLightContent();
      this.statusBar.backgroundColorByHexString('#282828');
      this.splashScreen.hide();

    });
  }

  pushSetup() {
    const options: PushOptions = {
      android: {
        senderID: '835519479865',
        "sound": true,
        "forceShow": true
      },
      ios: {
        alert: 'true',
        badge: 'true',
        sound: 'true',
        clearBadge: 'true'
      }
    };

    this.pushObject = this.push.init(options);

    this.pushObject.on('registration').subscribe((registration: any) => {
      console.log(registration);
      this.firebaseProvider.updatePushNotificationsID(registration.registrationId);
    });


    this.pushObject.on('notification').subscribe((notification: any) => {
      console.log('sdasdadas');
      console.log(notification);
      if (this.platform.is('ios')) {
        if (notification.additionalData.foreground) {
          this.alertProvider.presentAlertWithTittle(notification.message);
        }
      } else this.alertProvider.presentAlertWithTittle(notification.message);
    })

    this.pushObject.on('error').subscribe(error =>console.log(error));
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

  imageReadyHandler(imageData: any) {
    this.alertProvider.presentLoadingCustom();
    this.firebaseProvider.uploadUserPhoto(imageData);
  }

  onChengePhotoClick(){
    let alert = this.cameraProvider.showChoiceAlert(this);
    alert.present();
  }

  checkForFirstLaunch():void {
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
}
