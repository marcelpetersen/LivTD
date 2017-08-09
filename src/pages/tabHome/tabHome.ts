import { Component, ViewChild} from '@angular/core';
import { NavController, NavParams, ViewController } from 'ionic-angular';
import { FirebaseProvider } from '../../providers/firebaseProvider'
import { InAppBrowserProvider } from '../../providers/inAppBrowserProvider';
import { AlertProvider } from '../../providers/alert'

@Component({
  selector: 'page-tabHome',
  templateUrl: 'tabHome.html'
})
export class tabHomePage {
 
 images: Array<any>;


 constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController, public firebaseProvider: FirebaseProvider, public browser: InAppBrowserProvider, public alertProvider: AlertProvider) {
    this.images = [];
    this.alertProvider.presentLoadingCustom();
    let eventsRef = this.firebaseProvider.getEventsRef();

    eventsRef.once('value', snapshot => {
    
    let snapshotObj = snapshot.val();

    if (snapshotObj) {
      var keyNames = Object.keys(snapshotObj);
      for (let name of keyNames) {
        this.images.push(snapshotObj[name]);
      }

    }
    this.alertProvider.dismissLoadingCustom();
    })

  }

  onEventClick(image) {
    this.browser.openURL(image.url);
  }
  
}
