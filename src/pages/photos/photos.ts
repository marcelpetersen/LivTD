import { Component } from '@angular/core';
import { NavController, NavParams, ModalController } from 'ionic-angular';

import { FullscreenphotoPage } from '../fullscreenphoto/fullscreenphoto';

import { FacebookService } from '../../providers/facebookService';
import { AlertProvider } from '../../providers/alert';
import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/map'


@Component({
  selector: 'page-photos',
  templateUrl: 'photos.html'
})
export class PhotosPage {

  albums: Array<any>;
  images: Array<any>;

  constructor(public navCtrl: NavController, public navParams: NavParams, public modalCtrl: ModalController, public fbService : FacebookService, public loader : AlertProvider) {
	  this.albums = [];

	  this.images = [];

	  this.fbService.getAlbums().then(() => {
		  this.fbService.getAlbumPhoto(25).then((data: any) => {
			  console.log('DATA:');
			  console.log(data);
			  if (!data.isEnd) {
				  this.addNewAlbum(data.album);
				  this.addNewPhotos(data.photos);
			  }
		  });
	  })
  }

  showFullPhoto(images, image) {
    let modal = this.modalCtrl.create(FullscreenphotoPage, {images: images, image : image});
    modal.present();
  }

  addNewAlbum(albumData:any) {
  	let newAlbum = {
			"id": albumData.id,
			"name" : albumData.name,
			"created_at": albumData.created_time
  	}
		if (!this.containAlbum(newAlbum))
			this.albums.push(newAlbum);
  }

  addNewPhotos(photosData: any) {

	for(let data of photosData){
		var newPhoto = {
			"url": data.source,
			"url_mini": data.picture,
			"name" : "",//TODO
			"album_id" : data.album.id,
			"created_at": data.created_time
		}
		this.images.push(newPhoto);
	}
  }

  containAlbum(newAlbum:any):boolean {
	for (let album of this.albums)
		if (album.id === newAlbum.id)
			return true;
	return false;
  }

  doInfinite(infiniteScroll: any) {
	  this.fbService.getAlbumPhoto(25).then((data: any) => {
		  if (!data.isEnd) {
			  this.addNewAlbum(data.album);
			  this.addNewPhotos(data.photos);
		  }
		  infiniteScroll.complete();
	  });
  }

 // {"id": 1, "name": "Day of Knowledge", "created_at": "1488851976362"},
      // {"id": 2, "name": "", "created_at": "1488851976362"},

  // {"url": "http://www.hdwallpapers.in/walls/for_honor_tournament_4k_8k-wide.jpg", "url_mini": "assets/img/photos/1_mini.png", "name": "Walk in the park", "album_id": 1, "created_at": "1488851976362", "author_id": "1"},
      // {"url": "http://www.hdwallpapers.in/walls/minions_2017_4k_8k-wide.jpg", "url_mini": "assets/img/photos/2_mini.png", "name": "Photo name 1", "album_id": 1, "created_at": "1488851976362", "author_id": "1"},
      // {"url": "http://www.hdwallpapers.in/walls/despicable_me_3_minions_4k_8k-wide.jpg", "url_mini": "assets/img/photos/3_mini.png", "name": "Photo name 2", "album_id": 1, "created_at": "1488851976362", "author_id": "1"},
      // {"url": "http://www.hdwallpapers.in/walls/powerful_megaflares_4k_8k-wide.jpg", "url_mini": "assets/img/photos/3_mini.png", "name": "Photo name 3", "album_id": 1, "created_at": "1488851976362", "author_id": "1"},
      // {"url": "http://www.hdwallpapers.in/walls/minions_4k_8k-HD.jpg", "url_mini": "assets/img/photos/5_mini.png", "name": "Photo name 4", "album_id": 1, "created_at": "1488851976362", "author_id": "1"},
      // {"url": "http://www.hdwallpapers.in/walls/for_honor_tournament_4k_8k-wide.jpg", "url_mini": "assets/img/photos/6_mini.png", "name": "Photo name 5", "album_id": 1, "created_at": "1488851976362", "author_id": "1"},
      // {"url": "http://www.hdwallpapers.in/walls/despicable_me_3_minions_4k_8k-wide.jpg", "url_mini": "assets/img/photos/1_mini.png", "name": "Photo name 6", "album_id": 2, "created_at": "1488851976362", "author_id": "1"},
      // {"url": "http://www.hdwallpapers.in/walls/minions_4k_8k-HD.jpg", "url_mini": "assets/img/photos/1_mini.png", "name": "Walk in the park", "album_id": 1, "created_at": "1488851976362", "author_id": "1"},
      // {"url": "http://www.hdwallpapers.in/walls/despicable_me_3_minions_4k_8k-wide.jpg", "url_mini": "assets/img/photos/2_mini.png", "name": "Photo name 1", "album_id": 1, "created_at": "1488851976362", "author_id": "1"},
      // {"url": "http://www.hdwallpapers.in/walls/minions_4k_8k-HD.jpg", "url_mini": "assets/img/photos/2_mini.png", "name": "Photo name 7", "album_id": 2, "created_at": "1488851976362", "author_id": "1"},
      // {"url": "http://www.hdwallpapers.in/walls/for_honor_tournament_4k_8k-wide.jpg", "url_mini": "assets/img/photos/3_mini.png", "name": "Photo name 8", "album_id": 2, "created_at": "1488851976362", "author_id": "1"},
      // {"url": "http://www.hdwallpapers.in/walls/for_honor_tournament_4k_8k-wide.jpg", "url_mini": "assets/img/photos/4_mini.png", "name": "Photo name 9", "album_id": 2, "created_at": "1488851976362", "author_id": "1"},
      // {"url": "http://www.hdwallpapers.in/walls/minions_4k_8k-HD.jpg", "url_mini": "assets/img/photos/5_mini.png", "name": "Photo name 10", "album_id": 2, "created_at": "1488851976362", "author_id": "1"},
      // {"url": "http://www.hdwallpapers.in/walls/for_honor_tournament_4k_8k-wide.jpg", "url_mini": "assets/img/photos/6_mini.png", "name": "Photo name 11", "album_id": 2, "created_at": "1488851976362", "author_id": "1"},
      // {"url": "http://www.hdwallpapers.in/walls/despicable_me_3_minions_4k_8k-wide.jpg", "url_mini": "assets/img/photos/2_mini.png", "name": "Photo name 1", "album_id": 1, "created_at": "1488851976362", "author_id": "1"},
      // {"url": "http://www.hdwallpapers.in/walls/minions_4k_8k-HD.jpg", "url_mini": "assets/img/photos/2_mini.png", "name": "Photo name 7", "album_id": 2, "created_at": "1488851976362", "author_id": "1"},
 
	

}

