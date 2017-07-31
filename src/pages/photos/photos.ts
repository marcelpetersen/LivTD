import { Component } from '@angular/core';
import { NavController, NavParams, ModalController } from 'ionic-angular';

import { FullscreenphotoPage } from '../fullscreenphoto/fullscreenphoto';

import { FacebookService } from '../../providers/facebookService';
import { AlertProvider } from '../../providers/alert';



@Component({
  selector: 'page-photos',
  templateUrl: 'photos.html'
})
export class PhotosPage {

  albums: Array<any>;
  images: Array<any>;
  endOfAlbumList: boolean = false;

  constructor(public navCtrl: NavController, public navParams: NavParams, public modalCtrl: ModalController, public fbService : FacebookService, public loader : AlertProvider) {
	  this.albums = [];

	  this.loader.presentLoadingCustom();

	  this.loadAlbums().then(() => this.loader.dismissLoadingCustom());
	 
  }

  showFullPhoto(album:any) {
  	this.navCtrl.push(FullscreenphotoPage,{
  		selectedAlbum : album
  	});
    // let modal = this.modalCtrl.create(FullscreenphotoPage, {images: images, image : image});
    // modal.present();
  }

  addNewAlbums(data:any) {
  	for(let album of data) {
  		let presentedAlbum = {
				coverURL: album.picture.data.url,
				name:album.name,
				photoCount: album.photo_count,
				id : album.id,
				createdTime: album.created_time
  		}
  		if (!this.albums.some(element => element.id === presentedAlbum.id)) {
			this.albums.push(presentedAlbum);
  		}
		
  	}
  }

 loadAlbums():Promise<any> {
	return this.fbService.getAlbums().then((data: any) => {
		this.addNewAlbums(data.data);
		if (data.isEnd)			
			this.endOfAlbumList = data.isEnd;
	 });
 }

  doInfinite(infiniteScroll: any) {
	  console.log("doInfinite");
	 	if(!this.endOfAlbumList){			
			this.loadAlbums().then(() => infiniteScroll.complete());			
	 	} else 
		  	infiniteScroll.complete();
  }

 
}

// this.fbService.getAlbums().then(() => {
// 	this.fbService.getAlbumPhoto(25).then((data: any) => {
// 		console.log('DATA:');
// 		console.log(data);
// 		if (!data.isEnd) {
// 			this.addNewAlbum(data.album);
// 			this.addNewPhotos(data.photos);
// 		}
// 		this.loader.dismissLoadingCustom();
// 	}).catch(() => {
// 		this.loader.dismissLoadingCustom();
// 	});
// })


// addNewAlbum(albumData:any) {
// 	let newAlbum = {
// 		"id": albumData.id,
// 		"name": albumData.name,
// 		"created_at": albumData.created_time
// 	}
// 	if (!this.albums.some(album => album.id === newAlbum.id))
// 		this.albums.push(newAlbum);
// }

// addNewPhotos(photosData: any) {

// 	for (let data of photosData) {
// 		var newPhoto = {
// 			"url": data.source,
// 			"url_mini": data.picture,
// 			"name": "",//TODO
// 			"album_id": data.album.id,
// 			"created_at": data.created_time
// 		}
// 		this.images.push(newPhoto);
// 	}
// }