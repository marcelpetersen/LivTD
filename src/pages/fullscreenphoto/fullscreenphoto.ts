import { Component } from '@angular/core';
import { NavController, NavParams, ViewController } from 'ionic-angular';
import { FacebookService } from '../../providers/facebookService';
import { AlertProvider } from '../../providers/alert';
// import {KSSwiperContainer, KSSwiperSlide} from 'angular2-swiper';

/*
  Generated class for the Fullscreenphoto page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-fullscreenphoto',
  templateUrl: 'fullscreenphoto.html'
})
export class FullscreenphotoPage {

 //  @ViewChild(KSSwiperContainer) swiperContainer: KSSwiperContainer;
	// public image: any;
 //  images: any;
 //  example1SwipeOptions: any;
  album: any = null;
  photos: Array<any> = [];
  endOfPhotoList: boolean = false;
  constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController, public fbService: FacebookService, public loader: AlertProvider) {
    this.album = this.navParams.get('selectedAlbum');
    console.log(this.album);
    this.endOfPhotoList = false;
    this.loader.presentLoadingCustom();
    this.loadPhotos().then(() => this.loader.dismissLoadingCustom());
  }

  loadPhotos(): Promise<any> {
    return this.fbService.getPhotos(this.album.id).then((data: any) => {
      console.log(data);
      this.addNewPhotos(data.data);
      if (data.isEnd)
        this.endOfPhotoList = data.isEnd;
    });
  }

  addNewPhotos(data:any) {
    for(let photo of data){
      if (!this.photos.some(element => element.id === photo.id)){
        photo.name = this.album.name;
        this.photos.push(photo);
      }
    }
     console.log(this.photos);
  }

  doInfinite(infiniteScroll: any) {
   
    if (!this.endOfPhotoList) {
      this.loadPhotos().then(() => infiniteScroll.complete());
    } else
      infiniteScroll.complete();
  }
}



   //  this.images = navParams.get("images");
    // this.image = navParams.get("image");

   //  this.example1SwipeOptions = {
   //    slidesPerView: 1,
   //    loop: true,
   //    initialSlide: this.images.indexOf(this.image),
   //    showNavButtons: true,
   //    preloadImages: false,
   //    lazyLoading: true,
   //    onLazyImageReady: function(swiper, slide, image) {
   //      console.log(swiper, slide, image);
   //    }
   //  };