import { Component, ViewChild, AfterViewInit } from '@angular/core';
import { NavController, NavParams, ViewController } from 'ionic-angular';
import {KSSwiperContainer, KSSwiperSlide} from 'angular2-swiper';

/*
  Generated class for the Fullscreenphoto page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-fullscreenphoto',
  templateUrl: 'fullscreenphoto.html'
})
export class FullscreenphotoPage implements AfterViewInit {

  @ViewChild(KSSwiperContainer) swiperContainer: KSSwiperContainer;
	public image: any;
  images: any;
  example1SwipeOptions: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController) {
    this.images = navParams.get("images");
  	this.image = navParams.get("image");

    this.example1SwipeOptions = {
      slidesPerView: 1,
      loop: true,
      initialSlide: this.images.indexOf(this.image),
      showNavButtons: true,
      preloadImages: false,
      lazyLoading: true,
      onLazyImageReady: function(swiper, slide, image) {
        console.log(swiper, slide, image);
      }
    };
  }

  moveNext() {
    this.swiperContainer.swiper.slideNext();
  }

  movePrev() {
    this.swiperContainer.swiper.slidePrev();
  }

  ngAfterViewInit() {
    // console.log(this.swiperContainer);
  }

  closeModal() {
    this.viewCtrl.dismiss();
  }
}
