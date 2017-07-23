import { Injectable } from '@angular/core';
import { AlertController, LoadingController } from 'ionic-angular';

@Injectable()

export class AlertProvider {

  loading:any;
	
	constructor(public alertCtrl: AlertController, public loadingCtrl: LoadingController ) {
    
	}

	presentAlertWithTittle(tittle:string) {
    let alert = this.alertCtrl.create( {
      title: tittle,
      buttons: ['Ok']
    });
    alert.present();
  }

  presentLoadingCustom() {
    this.loading = this.loadingCtrl.create({
     content: '<div class="custom-spinner-container"><div class="custom-spinner-box"><ion-spinner name="circles"></ion-spinner>Loading Please Wait...</div></div>'
    });
    this.loading.onDidDismiss(() => {
      console.log('Dismissed loading');
    });
    console.log(this.loading);
    this.loading.present();
  }
  dismissLoadingCustom() {
    console.log(this.loading);
    this.loading.dismiss();
  }
}