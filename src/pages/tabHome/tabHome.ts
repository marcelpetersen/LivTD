import { Component, ViewChild, AfterViewInit} from '@angular/core';
import { NavController, NavParams, ViewController } from 'ionic-angular';
// import {KSSwiperContainer, KSSwiperSlide} from 'angular2-swiper';


@Component({
  selector: 'page-tabHome',
  templateUrl: 'tabHome.html'
})
export class tabHomePage implements AfterViewInit{
  // @ViewChild(KSSwiperContainer) swiperContainer: KSSwiperContainer;
 images: any;
 // swiperOptions: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController) {
   	this.images = Array(
      {"urlPhoto": "assets/V13xWyu6TQivk2uYlDa5_pyt-presents-ruen.jpg", "url": ""},
      {"urlPhoto": "assets/2EwMEn9RQHePiiafKyo6_kaskade.jpg", "url": ""},
      {"urlPhoto": "assets/YO3b4z57TaaldEuA720P_lil-yachty-irie.jpg", "url": ""},
      {"urlPhoto": "assets/FCugJtlXRdSZ0ZcTSYuE_kevin-hart-irie-liv-on-sunday.jpg", "url": ""}
     );
    //  this.swiperOptions = {
    //   slidesPerView: 1,
    //   loop: true,
    //   // preloadImages: false,
    //   // lazyLoading: true,
    //   autoplay: 3000,
    //   paginationIsActive: true,
    // };

  }

  ngAfterViewInit() {
    // console.log(this.swiperContainer);
  }
  
}
