import { Http } from '@angular/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Rx'; 
import 'rxjs/add/operator/map'

@Injectable()

export class FacebookService {
	
	public pageName = 'LIVMiami';
	private accessToken = '2002709960016162|54Uhc3mzKarsHI3Fnd7-jEUMUHo';
	private graphUrl = 'https://graph.facebook.com/';
	private accessTokenDescription = `&access_token=${this.accessToken}`;
	private nextAlbumPageURL: string = null;
	private nextPhotoPageURL: string = null;
    
	constructor(private http: Http)  {
		
	}

	getAlbums(): Promise<any> {
		if (!this.nextAlbumPageURL)
			this.nextAlbumPageURL = this.graphUrl + this.pageName + '/albums?fields=picture,name,photo_count,id,created_time&limit=20' + this.accessTokenDescription;
		return this.getData(this.nextAlbumPageURL, false);
	}

	getPhotos(albumID?:string):Promise<any> {
		if (!this.nextPhotoPageURL)
			this.nextPhotoPageURL = this.graphUrl +
				+ albumID
				+ '/photos?fields=source,picture,name,created_time,album&limit=20'
				+ '&access_token=' + this.accessToken;
		return this.getData(this.nextPhotoPageURL,true);
	}

	resetNextAlbumPageURL() {
		this.nextAlbumPageURL = null;
	}

	resetNextPhotoPageURL(newNextPageURL?:string) {
		this.nextPhotoPageURL = newNextPageURL? newNextPageURL: null;
	}

	getNextPhotoPageURL():string {
		return this.nextPhotoPageURL;
	}

	getData(query:string, isPhotos: boolean):Promise<any> {
		return new Promise(resolve => {
			this.http.
				get(query).
				map(response =>
					response.json()
				).subscribe(data => {
					let dataToUser = {
						isEnd: false,
						data: data.data
					}
					if (!data.paging.next) {
						dataToUser.isEnd = true;
					}
					else {
						if (isPhotos)
							this.nextPhotoPageURL = data.paging.next;
						else
							this.nextAlbumPageURL = data.paging.next;
					}
					resolve(dataToUser);
				});
		});
	}
	


	getPicture(id:string, type: string) :Observable<any> {
		let url = this.graphUrl + id + '/picture?type=' + type + '&access_token='+ this.accessToken;
		return this.http
					.get(url)
			.map(response => {
			 return response;
			});
	}

	getGroupName() : Observable<any> {
		let url = this.graphUrl + this.pageName + '?fields = name&access_token='+ this.accessToken;
		return this.http
			.get(url)
			.map(response => response.json());
	}
}



