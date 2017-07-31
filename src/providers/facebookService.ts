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
		console.log("FacebookService");
	}


	getAlbums(): Promise<any> {
		if (!this.nextAlbumPageURL)
			this.nextAlbumPageURL = this.graphUrl + this.pageName + '/albums?fields=picture,name,photo_count,id,created_time&limit=20' + this.accessTokenDescription;
		return this.getData(this.nextAlbumPageURL, false);
	}

	getPhotos(albumID:string):Promise<any> {
		console.log(this.nextPhotoPageURL);
		if (!this.nextPhotoPageURL)
			this.nextPhotoPageURL = this.graphUrl +
				+ albumID
				+ '/photos?fields=source,picture,name,created_time,album&limit=20'
				+ '&access_token=' + this.accessToken;
		return this.getData(this.nextPhotoPageURL,true);
	}


	getData(query:string, isPhotos: boolean):Promise<any> {
		return new Promise(resolve => {
			this.http.
				get(query).
				map(response =>
					response.json()
				).subscribe(data => {

					console.log(data);
					let dataToUser = {
						isEnd: false,
						data: data.data
					}
					if (data.data.length < 20) {
						dataToUser.isEnd = true;
						if (isPhotos)
							this.nextPhotoPageURL = null;
						else
							this.nextAlbumPageURL = null;
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


//
//
//////////////////////////////////OLD VERSION//////////////////////////////////
//
//
// getAlbums() {


	// 	return new Promise(resolve => {
	// 		if (this.isEndOfAlbums)
	// 			resolve(false);
	// 		else
	// 		this.http.
	// 			get(this.albumsURL).
	// 			map(response =>
	// 				response.json()
	// 			).subscribe(data => {
	// 				this.albums = data.albums.data;
	// 				this.albums.sort((album1, album2) => {
	// 					var date1 = new Date(album1.created_time).getTime();
	// 					var date2 = new Date(album2.created_time).getTime()
	// 					return date2 - date1;
	// 				});
	// 				;
	// 				if (this.albums.length < 20){

	// 				this.albumsURL = data.albums.paging.next;
	// 				this.isEndOfAlbums = true;
	// 				}
	// 				resolve(true);
	// 			});
	// 	});

	// }

	// getAlbumPhoto( albumID:string, limit:number) {
	// 	let url = this.graphUrl  + 
	// 		+ albumID 
	// 		+ '/photos?fields=source,picture,name,created_time,album&limit=' + limit
	// 		+ '&offset=' + this.photosOffset
	// 		+ '&access_token=' + this.accessToken ;

	// 	return new Promise(resolve => {
	// 		this.http
	// 			.get(url)
	// 			.map(response => response.json()).subscribe(data => {
	// 				console.log(data);
	// 				let photoData = {
	// 					"album": this.albums[this.currentAlbumIndex ],
	// 					"photos" : data.data,
	// 					"isEnd" : false
	// 				}
	// 				this.photosOffset += limit;
	// 				if(data.data.length < limit){
	// 					this.photosOffset = 0;
	// 					this.currentAlbumIndex++;
	// 					if (this.currentAlbumIndex >= this.albums.length)
	// 						this.getAlbums().then((val) => {
	// 							if (val)
	// 								photoData.album = this.albums[this.currentAlbumIndex - 1];
	// 							else
	// 								photoData.isEnd = true;
	// 						})
	// 				}
	// 				resolve(photoData); 

	// 			});
	// 	})

	// }
