import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { Camera } from '@ionic-native/camera';
import { TextMaskModule } from 'angular2-text-mask';
import { MyApp } from './app.component';
import { HttpModule } from '@angular/http';

import { ImageThumbGallery } from '../components/image-thumb-gallery/image-thumb-gallery';
import { GroupByPipe } from '../pipes/group-by-pipe';
import { Safe } from '../pipes/pipe';
import {KSSwiperModule} from 'angular2-swiper';

import { HomePage } from '../pages/home/home';
import { ListPage } from '../pages/list/list';
import {MyProfilePage} from '../pages/myProfile/myProfile'
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
import { RegistrationPage } from "../pages/auth/registration/registration";
import { LoginPage } from '../pages/auth/login/login';
import { ResetPasswordPage } from '../pages/auth/resetPassword/resetPassword';
import { FullscreenphotoPage } from '../pages/fullscreenphoto/fullscreenphoto';

import { tabHomePage } from '../pages/tabHome/tabHome';
import { tabChatPage } from '../pages/tabChat/tabChat';

import { IonicStorageModule } from '@ionic/storage';
import { FirebaseProvider } from '../providers/firebaseProvider';
import { StorageProvider } from '../providers/storage';
import { CameraProvider } from '../providers/camera';
import { AlertProvider } from '../providers/alert';
import { FacebookService } from '../providers/facebookService';
import { YouTubeService } from '../providers/youtubeService';
import { Facebook } from '@ionic-native/facebook'
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { InAppBrowserProvider } from '../providers/inAppBrowserProvider'
import { Clipboard } from '@ionic-native/clipboard';
import { CallNumber } from '@ionic-native/call-number';
import { EmailComposer } from '@ionic-native/email-composer';
import { LaunchNavigator } from '@ionic-native/launch-navigator';
import { SafePipe } from '../providers/safePipe';
import { EmojiPickerModule } from 'angular2-emoji-picker';
import { PostmarkProvider } from '../providers/postmarkProvider'
import  firebase from 'firebase';

import { YoutubeVideoPlayer } from '@ionic-native/youtube-video-player';

 firebase.initializeApp({
      apiKey: "AIzaSyCGm_zj91dJXbel2VwqSSSWoOfyc1jERP8",
      authDomain: "liv-app-8af89.firebaseapp.com",
      databaseURL: "https://liv-app-8af89.firebaseio.com",
      storageBucket: "liv-app-8af89.appspot.com",
      messagingSenderId: "835519479865"
    });

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    ListPage,
    RegistrationPage,
    LoginPage,
    ResetPasswordPage,
    MyProfilePage,
    AboutPage,
    BookTablePage,
    BuyTicketsPage,
    ContactPage,
    FunPage,
    HotelReservationsPage,
    LatestNewsPage,
    LivTVPage,
    PhotosPage,
    ShopPage,
    UpcomingEventsPage,
    FullscreenphotoPage,
    tabHomePage,
    tabChatPage,
    ImageThumbGallery,
    GroupByPipe,
    Safe,
    SafePipe
  ],
  imports: [
    BrowserModule,
    KSSwiperModule,
    IonicModule.forRoot(MyApp, {
      backButtonText: '',
    }),
    TextMaskModule,
    IonicStorageModule.forRoot(),
    BrowserModule, 
    HttpModule,
    EmojiPickerModule.forRoot()
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    ListPage,
    RegistrationPage,
    LoginPage,
    ResetPasswordPage,
    MyProfilePage,
    AboutPage,
    BookTablePage,
    BuyTicketsPage,
    ContactPage,
    FunPage,
    HotelReservationsPage,
    LatestNewsPage,
    LivTVPage,
    PhotosPage,
    ShopPage,
    FullscreenphotoPage,
    tabHomePage,
    tabChatPage,
    UpcomingEventsPage
  ],
  providers: [
    SafePipe,
    LaunchNavigator,
    FirebaseProvider,
    Clipboard,
    CallNumber,
    EmailComposer,
    InAppBrowserProvider,   
    FacebookService,
    YouTubeService,
    AlertProvider,
    CameraProvider,
    StorageProvider,
    StatusBar,
    SplashScreen,
    Facebook,
    Camera,
    YoutubeVideoPlayer,
    PostmarkProvider,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
