import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { Events } from 'ionic-angular';

@Injectable()

export class StorageProvider {
	
	constructor(public storage: Storage , public events: Events) {
	}

	setItem(key:string, data:any) {
		
		this.storage.set(key, data).then(() => {
			if (key === 'curent_user')
				this.events.publish('user:changed', data.displayName, data.photoURL);		
		}).catch((error) => {
			console.log('StorageProvider: Data saving fail with error: '+ error);
		});
	}

	getItem(key:string):Promise<any> {
		return this.storage.get(key);
	}

	clear(): Promise<any> {
		this.storage.remove('pictureToPast');
		return this.storage.remove('curent_user');
	}

}