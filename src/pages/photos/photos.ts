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
	  this.fbService.resetNextAlbumPageURL();
	  this.loader.presentLoadingCustom();
	  this.loadAlbums().then(() => this.loader.dismissLoadingCustom());
  }

  showFullPhoto(album:any) {
  	this.navCtrl.push(FullscreenphotoPage,{
  		selectedAlbum : album
  	});
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
	 	if(!this.endOfAlbumList){			
			this.loadAlbums().then(() => infiniteScroll.complete());			
	 	} else 
		  	infiniteScroll.complete();
  }

 
}
