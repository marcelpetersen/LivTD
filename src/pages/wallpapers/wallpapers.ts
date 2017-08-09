import { Component } from '@angular/core';
import { NavController} from 'ionic-angular';
import { AlertProvider } from '../../providers/alert'
import { FirebaseProvider } from '../../providers/firebaseProvider'
import { FileTransferProvider } from '../../providers/fileTransfer';

@Component({
  selector: 'wallpapers-page',
  templateUrl: 'wallpapers.html'
})
export class WallpapersPage {

 images: Array<any>;

 constructor(public navCtrl: NavController, public firebaseProvider: FirebaseProvider, public fileTransferProvider: FileTransferProvider,public alertProvider: AlertProvider) {
    this.images = [];
    this.alertProvider.presentLoadingCustom();
    let wallpapersRef = this.firebaseProvider.getWallpapersRef();

    wallpapersRef.once('value', snapshot => {
    
    let snapshotObj = snapshot.val();

    if (snapshotObj) {
      var keyNames = Object.keys(snapshotObj);
      for (let name of keyNames) {
        this.images.push({
          url: snapshotObj[name],
          key: name
        });
      }

    }
    this.alertProvider.dismissLoadingCustom();
    })
  }

  saveWallpaper(image) {
    this.fileTransferProvider.saveImage(image.url);
  }
}

