import { Injectable } from '@angular/core';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { AlertProvider } from '../providers/alert';
import { Events } from 'ionic-angular';



@Injectable()

export class CameraProvider {

	
	cameraOptions: CameraOptions;

	constructor(public camera: Camera, public alertProvider: AlertProvider, public events: Events) {
		this.cameraOptions = {
      		quality: 60,
      		destinationType : this.camera.DestinationType.FILE_URI,
      		encodingType: this.camera.EncodingType.JPEG,
      		mediaType: this.camera.MediaType.PICTURE,
      		targetWidth: 300,
      		targetHeight: 300,
			correctOrientation: true
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

	showChoiceAlert(obj:any):any {
		let alert = this.alertProvider.alertCtrl.create({
			buttons: [
				{
					text: 'Choose From Gallery',
					handler: () => {
					    this.choosePhotoFromGalery().then((imageData) => {
							obj.imageReadyHandler(encodeURI(imageData));
						}).catch((error: any) => {
							console.log('Error2' + error);
						});
						
						return true;
					}
				},
				{
					text: 'Take a photo',
					handler: () => {
						;
						this.takePhotoFromCamera().then((imageData) => {
							obj.imageReadyHandler(encodeURI(imageData));						
						}).catch((error: any) => {
							console.log(error);

						});

					}
				}
			]
		});
		return alert;
	}

	

}  