import { Http } from '@angular/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/map'
@Injectable()

export class YouTubeService {
	
	private accessToken = "AIzaSyBzL2Zby_UmcGdt5VQ7jlQvDwiW428GQyY";
	private chanelID = "UCWz8yrXPYtugxcgsnFmWm0Q";
	private searchURL = "https://www.googleapis.com/youtube/v3/search?order=date&part=snippet"
	private maxResults = 5;
	private nextPageToken="";	
	private isLastPage: boolean = false;

	constructor(private http: Http) {
		
	}

	getVideos():Promise<any> {
		let query = this.searchURL + "&type=video&channelId=" + this.chanelID + this.nextPageToken + "&maxResults=" + this.maxResults + "&key=" + this.accessToken + this.nextPageToken;
		return this.doQuery(query);
	}

	getFoundVideos(keyword:string): Promise<any> {

		let query = this.searchURL + "&channelId=" + this.chanelID + this.nextPageToken + "&maxResults=" + this.maxResults + "&key=" + this.accessToken + "&q=" + keyword;
		return this.doQuery(query);
	}

	doQuery(query:string):Promise<any> {
		return new Promise(resolve => {
			this.http.get(query)
				.map(response => response.json())
				.subscribe(data => {
					if (!this.isLastPage) {
						let items = data.items;
						if (items.length < this.maxResults)
							this.isLastPage = true;
						else {
							this.nextPageToken = "&pageToken=" + data.nextPageToken;
						}
						resolve(items);
					}
					else resolve(null);
				});
		})
	}

	changeMode() {
		this.nextPageToken = "";
		this.isLastPage = false;
	}

	getVideoDescription(videoID: string): Promise<any>{
		let url = 'https://www.googleapis.com/youtube/v3/videos?part=snippet&id=' + videoID + '&key=' + this.accessToken;
		return new Promise(resolve => {
			this.http.get(url).map(response => response.json()).subscribe(data => {
				resolve(data)
			});
		})
	}
}