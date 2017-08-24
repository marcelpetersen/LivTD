import { Injectable } from '@angular/core';
import { AlertController, LoadingController , ToastController} from 'ionic-angular';

@Injectable()

export class AlertProvider {

  loading:any;
	
  constructor(public alertCtrl: AlertController, public loadingCtrl: LoadingController, public toastController : ToastController) {
    
	}

	presentAlertWithTittle(tittle:string) {
    let alert = this.alertCtrl.create( {
      title: tittle,
      buttons: ['Ok']
    });
    alert.present();
  }

  presentLoadingCustom() {
    if (!this.loading) {
      this.loading = this.loadingCtrl.create({
        content: '<div class="custom-spinner-container"><div class="custom-spinner-box"><ion-spinner name="circles"></ion-spinner>Loading Please Wait...</div></div>'
      });
      this.loading.present();
    }
  }
  dismissLoadingCustom() {
    if(this.loading){
      this.loading.dismiss();
      this.loading = null;
    }

  }

  presentCopyToast() {
    this.presentCustomToast('Copied to clipboard');
  }

  presentCustomToast(message){
    let toast = this.toastController.create({
      message: message,
      duration: 1500,
      position: 'middle'
    });

    toast.present();
  }

  resetPasswordToast(message:string) {
    this.toastWithButton(message);
  }

  toastWithButton(message:string){
    let toast = this.toastController.create({
      message: message,
      showCloseButton: true,
      closeButtonText: 'Ok',
      position: 'middle'
    });

    toast.present();
  }
}