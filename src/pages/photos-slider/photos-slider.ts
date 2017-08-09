import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, Slides, ActionSheetController } from 'ionic-angular';
import { FacebookService } from '../../providers/facebookService';
import { StorageProvider } from '../../providers/storage';
import { AlertProvider } from '../../providers/alert';
import { FileTransferProvider } from '../../providers/fileTransfer';
@Component({
  selector: 'page-photos-slider',
  templateUrl: 'photos-slider.html',
})
export class PhotosSliderPage {

  @ViewChild(Slides) slides: Slides;

	photo: any;
	photos: Array<any> = [];
  endOfAlbum: boolean = false;

  constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController, public facebookService: FacebookService,public storageProvider: StorageProvider
    , public actionSheetController: ActionSheetController, public alertProvider: AlertProvider, public fileTransferProvider: FileTransferProvider) {
   
    this.photos = this.navParams.get('images');
    this.endOfAlbum = this.navParams.get('endOfAlbum');

	}


  slideChanged() {
    let currentIndex = this.slides.getActiveIndex();
    if( currentIndex === this.photos.length - 5 && !this.endOfAlbum ) {
      this.facebookService.getPhotos().then(data => {       
        this.addNewPhotos(data.data);
        if (data.isEnd)
          this.endOfAlbum = true;
      });
    }
  }

  onPress(photo: any) {
    let actionSheet = this.actionSheetController.create({
      buttons: [
        {
          text: 'Copy',
          icon: 'ios-copy-outline',
          handler: () => {
            this.storageProvider.setItem('pictureToPast', photo.source);
            this.alertProvider.presentCustomToast('Copied');
          }
        },
        {
          text: 'Save',
          icon: 'ios-cloud-download-outline',
          handler: () => {
            this.fileTransferProvider.saveImage(photo.source);
          }
        }
      ]
    });

    actionSheet.present();
  }



  addNewPhotos(data: any) {
    for (let photo of data) { 
       this.photos.push(photo);
    }
  }

	close() {
  	this.viewCtrl.dismiss();
	}

}
