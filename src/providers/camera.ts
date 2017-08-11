import { Injectable } from '@angular/core';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { AlertProvider } from '../providers/alert';
import { Events } from 'ionic-angular';



@Injectable()

export class CameraProvider {

	static TO_SIDE_MENU :number  = 0;
	static TO_MYPROFILE: number = 1;
	static TO_CHAT: number = 2;
	cameraOptions: CameraOptions;

	constructor(public camera: Camera, public alertProvider: AlertProvider, public events: Events) {
		this.cameraOptions = {
      		quality:60,
      		destinationType : this.camera.DestinationType.FILE_URI,
      		encodingType: this.camera.EncodingType.JPEG,
      		mediaType: this.camera.MediaType.PICTURE,
      		targetWidth: 300,
      		targetHeight: 300
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

	showChoiceAlert(destinationType:number):any {
		let alert = this.alertProvider.alertCtrl.create({
			buttons: [
				{
					text: 'Choose From Gallery',
					handler: () => {
						
						this.choosePhotoFromGalery().then((imageData) => {
							//this.events.publish('loading_photo');
							
								this.sendImageDataTuSubscibers(imageData, destinationType);
							
							
							}).catch((error: any) => {
							console.log(error);
						});
						
					}
				},
				{
					text: 'Take a photo',
					handler: () => {
						;
						this.takePhotoFromCamera().then((imageData) => {
							//this.events.publish('loading_photo')
							
								this.sendImageDataTuSubscibers(imageData, destinationType);
					
							//this.sendImageDataTuSubscibers(imageData, destinationType);						
						}).catch((error: any) => {
							console.log(error);

						});

					}
				}
			]
		});
		return alert;
	}

	

	sendImageDataTuSubscibers(imageData:any, destinationType:number) {
		if (destinationType === CameraProvider.TO_SIDE_MENU)
			this.events.publish('sideMenu:changedPhoto', imageData);
		else if (destinationType === CameraProvider.TO_CHAT)
			this.events.publish('chat:changedPhoto', imageData);
		else
			this.events.publish('myProfile:changedPhoto',imageData);
	}
}  