import { Component, ViewChild, ElementRef } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Content } from 'ionic-angular';
import { YouTubeService } from '../../providers/youtubeService'

import { YoutubeVideoPlayer } from '@ionic-native/youtube-video-player';


@Component({
  selector: 'page-liv-tv',
  templateUrl: 'livTV.html'
})
export class LivTVPage {
  	@ViewChild(Content) content: Content;

	videos : Array<any>;
	searchInput : string;

	constructor(public navCtrl: NavController, public element: ElementRef, public navParams: NavParams, public youtubeService: YouTubeService, private youtube: YoutubeVideoPlayer) {
		this.videos = [];
		this.loadVideos();
		console.log(this.youtubeService);
  	}

  	scrollHandler(event) {
  	   var result = this.element.nativeElement.querySelector('.up-button');
	   if(event.scrollTop >= 500) {
	   		result.style.display = 'block';
	   } else {
	   		result.style.display = 'none';
	   }
	 }

  	scrollToTop() {
	    this.content.scrollToTop();
	}

  	openVideo(id) {
  		console.log(id);
  		console.log(this.youtube);
		this.youtube.openVideo(id);
  	}

  	addVideos(data:Array<any>) {
  		for(let obj of data){
  			// if(obj.id.videoId !== underfined)
				let video = {
					url: "https://www.youtube.com/embed/" + obj.id.videoId + "?rel=0&modestbranding=1&autohide=1&showinfo=0&controls=0",
					id: obj.id.videoId,
					title : obj.snippet.title,
					description : obj.snippet.description,
					img: obj.snippet.thumbnails.high.url
				}
			console.log(obj.id.videoId);
			this.videos.push(video);
  		}
			console.log(this.videos);
  	}

  	loadVideos(): Promise<any>{
		return this.youtubeService.getVideos().then(data => {
			console.log("YouTube Data:");
			console.log(data);
			if (data)
				this.addVideos(data);
		});
  	}



	doInfinite(infiniteScroll: any) {
		this.loadVideos().then(() => {
			infiniteScroll.complete();
		})
	}

	onCancel(event){
		this.toDefaultMode();
	}

	onSearchClick() {
		if (this.searchInput !== "") {
			this.videos = [];
			this.youtubeService.changeMode();
			this.youtubeService.getFoundVideos(this.searchInput).then(data => {
				if (data)
					this.addVideos(data);
			});
		}
	}

	onInput(event) {
		if (this.searchInput === "") {
			this.toDefaultMode();
		}
		
	}

	toDefaultMode()	{
		this.videos = [];
		this.youtubeService.changeMode();
		this.loadVideos();
	}
}
