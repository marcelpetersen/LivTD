import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { Events } from 'ionic-angular';

@Injectable()

export class StorageProvider {
	
	constructor(public storage: Storage , public events: Events) {
	}

	setItem(key:string, data:any) {
		console.log(data);
		this.storage.set(key, data).then(() => {
			this.events.publish('user:changed', data.displayName, data.photoURL);
			console.log('StorageProvider: Data saved');
		}).catch((error) => {
			console.log('StorageProvider: Data saving fail with error: '+ error);
		});
	}

	getItem(key:string):Promise<any> {
		console.log(this.storage.get(key));
		return this.storage.get(key);
	}

	clear(): Promise<any> {
		return this.storage.clear();
	}
}