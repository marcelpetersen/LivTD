import { Component } from '@angular/core';
import { NavController, NavParams, ViewController,ActionSheetController, ModalController } from 'ionic-angular';
import { FacebookService } from '../../providers/facebookService';
import { AlertProvider } from '../../providers/alert';
import { FileTransferProvider } from '../../providers/fileTransfer';
import { StorageProvider } from '../../providers/storage';
import { PhotosSliderPage } from '../photos-slider/photos-slider';

@Component({
  selector: 'page-fullscreenphoto',
  templateUrl: 'fullscreenphoto.html'
})
export class FullscreenphotoPage {

  album: any = null;
  photos: Array<any> = [];
  endOfPhotoList: boolean = false;
  nextPageURL: string;
  constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController, public fbService: FacebookService, public loader: AlertProvider
    , public actionSheetCtrl: ActionSheetController, public fileTransferProvider: FileTransferProvider, public storageProvider: StorageProvider, public modalCtrl: ModalController) {
    this.album = this.navParams.get('selectedAlbum');
    this.fbService.resetNextPhotoPageURL();
    this.endOfPhotoList = false;
    this.loader.presentLoadingCustom();
    this.loadPhotos().then(() => this.loader.dismissLoadingCustom());
  }

  loadPhotos(): Promise<any> {
    return this.fbService.getPhotos(this.album.id).then((data: any) => {
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
  }

  doInfinite(infiniteScroll: any) { 
    if (!this.endOfPhotoList) {
      this.loadPhotos().then(() => infiniteScroll.complete());
    } else
      infiniteScroll.complete();
  }

  showFullPhoto(photo:any) {
    this.nextPageURL = this.fbService.getNextPhotoPageURL();
    let modal = this.modalCtrl.create(PhotosSliderPage,
     {
       images : this.photos,
       endOfAlbum : this.endOfPhotoList,
       currentPhotoIndex: this.photos.indexOf(photo)
      });
    modal.onDidDismiss(() => this.fbService.resetNextPhotoPageURL(this.nextPageURL));
    modal.present();
  }

  onPress(photo:any) {
    let actionSheet = this.actionSheetCtrl.create({
      buttons: [
        {
          text: 'Copy',
          icon: 'ios-copy-outline',
          handler: () => {
            this.storageProvider.setItem('pictureToPast', photo.source);
            this.loader.presentCustomToast('Copied');
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
}

