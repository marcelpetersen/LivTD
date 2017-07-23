import { Http } from '@angular/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Rx'; 
import 'rxjs/add/operator/map'
@Injectable()

export class FacebookService {
	
	public pageName = 'LIVMiami';
	private accessToken = '2002709960016162|54Uhc3mzKarsHI3Fnd7-jEUMUHo';
	private graphUrl = 'https://graph.facebook.com/';
	private accessTokenDescription = `?access_token=${this.accessToken}`;

	private albums:Array<any>;
	private currentAlbumIndex = 0;
	private photosOffset = 0;

	private albumsURL: string;
	private isEndOfAlbums = false;

    //EAAcddDZCBQSIBAE35qy4zZBZCOy7ZC1lh8a4xlnMdAKqZBOvxPxhZAZBMRRsLcJjEzvnfp551wt009vq6nYX2RZAsylmmZAHN22M4wK99uPeSBvE7MLmfmCdkZCPYQgnxRfpKSGPWqZAsP1n2nPQ8F5O30hxuRPiS6Ulpyqg66YZAYuoImlOTzruqVKXyqULa6x7VxsZD
	constructor(private http: Http)  {
	//fields=cover_photo,photo_count,photos{images}	
	//540753079293942/picture?type=normal
		this.albumsURL = this.graphUrl + this.pageName + this.accessTokenDescription + '&fields=albums{cover_photo,name,photo_count,id,created_time}&limit=5';
		
	}

	getAlbums() {
		
		 
		return new Promise(resolve => {
			if (this.isEndOfAlbums)
				resolve(false);
			else
			this.http.
				get(this.albumsURL).
				map(response =>
					response.json()
				).subscribe(data => {
					this.albums = data.albums.data;
					this.albums.sort((album1, album2) => {
						var date1 = new Date(album1.created_time).getTime();
						var date2 = new Date(album2.created_time).getTime()
						return date2 - date1;
					});
					;
					if (this.albums.length < 5){

					this.albumsURL = data.albums.paging.next;
					this.isEndOfAlbums = true;
					}
					resolve(true);
				});
		});

	}

	getAlbumPhoto(limit:number) {
		let url = this.graphUrl  + 
			+ this.albums[this.currentAlbumIndex].id 
			+ '/photos?fields=source,picture,name,created_time,album&limit=' + limit
			+ '&offset=' + this.photosOffset
			+ '&access_token=' + this.accessToken ;

		return new Promise(resolve => {
			this.http
				.get(url)
				.map(response => response.json()).subscribe(data => {
					console.log(data);
					let photoData = {
						"album": this.albums[this.currentAlbumIndex ],
						"photos" : data.data,
						"isEnd" : false
					}
					this.photosOffset += limit;
					if(data.data.length < limit){
						this.photosOffset = 0;
						this.currentAlbumIndex++;
						if (this.currentAlbumIndex >= this.albums.length)
							this.getAlbums().then((val) => {
								if (val)
									photoData.album = this.albums[this.currentAlbumIndex - 1];
								else
									photoData.isEnd = true;
							})
					}
					resolve(photoData); 
					
				});
		})
		 	
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