import { Injectable } from '@angular/core';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { AlertProvider } from '../providers/alert';
import { Events } from 'ionic-angular';

@Injectable()

export class CameraProvider {
	
	cameraOptions: CameraOptions;

	constructor(public camera: Camera, public alertProvider: AlertProvider, public events: Events) {
		this.cameraOptions = {
      		quality:100,
      		destinationType : this.camera.DestinationType.DATA_URL,
      		encodingType: this.camera.EncodingType.JPEG,
      		mediaType: this.camera.MediaType.PICTURE
    	}
	}

	takePhotoFromCamera():any {
		this.cameraOptions.sourceType = this.camera.PictureSourceType.CAMERA;
		return this.camera.getPicture(this.cameraOptions);
	}

	choosePhotoFromGalery():any {
		this.cameraOptions.sourceType = this.camera.PictureSourceType.PHOTOLIBRARY;
		return this.camera.getPicture(this.cameraOptions);
	}

	toChatMode() {
		this.cameraOptions.targetWidth = 300;
		this.cameraOptions.targetHeight = 300;
	}

	showChoiceAlert(toUpload: boolean):void {
		let alert = this.alertProvider.alertCtrl.create({
			buttons: [
				{
					text: 'Choose From Gallery',
					handler: () => {
						this.choosePhotoFromGalery().then((imageData) => {
							this.events.publish('changedPhoto', imageData, toUpload);
						}).catch((error: any) => {
							console.log(error);
						});

					}
				},
				{
					text: 'Take a photo',
					handler: () => {
						this.takePhotoFromCamera().then((imageData) => {
							this.events.publish('changedPhoto', imageData, toUpload);
						}).catch((error: any) => {
							console.log(error);
						});

					}
				}
			]
		});
		alert.present();
	}
} 