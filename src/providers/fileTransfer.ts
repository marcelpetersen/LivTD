import { PhotoLibrary } from '@ionic-native/photo-library';
import { Injectable } from '@angular/core';
import { FileTransfer, FileTransferObject } from '@ionic-native/file-transfer';
import { AlertProvider } from '../providers/alert'

declare var cordova;

@Injectable()
export class FileTransferProvider  {
	
	constructor(public photoLibrary: PhotoLibrary, public transfer: FileTransfer, public alertProvider: AlertProvider) {
		// code...
	}

	saveImage(imageURL) {
		let uri = encodeURI(imageURL);
		var fileTransfer = this.transfer.create();
		const filename = Math.floor(Date.now() / 1000);
		fileTransfer.download(imageURL, cordova.file.dataDirectory + filename + '.jpg', true).then(entry => {
			let targetPath = entry.toURL();
			this.photoLibrary.requestAuthorization().then(() => {
				this.photoLibrary.saveImage(targetPath, 'LIV App').then(() => {
					this.alertProvider.presentCustomToast("Saved");
				}).catch(error => console.log(error));
			})
		}).catch(error => console.log(error));

	}
}