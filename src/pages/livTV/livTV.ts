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
	isSearchResultEmpty: boolean = false;

	constructor(public navCtrl: NavController, public element: ElementRef, public navParams: NavParams, public youtubeService: YouTubeService, private youtube: YoutubeVideoPlayer) {
		this.videos = [];
		this.youtubeService.changeMode();
		this.loadVideos();

  	}

  	scrollHandler(event) {
  	 //   var result = this.element.nativeElement.querySelector('.up-button');
	   // if(event.scrollTop >= 500) {
	   // 		result.style.display = 'block';
	   // } else {
	   // 		result.style.display = 'none';
	   // }
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
				let video = {
					url: "https://www.youtube.com/embed/" + obj.id.videoId + "?rel=0&modestbranding=1&autohide=1&showinfo=0&controls=0",
					id: obj.id.videoId,
					title : obj.snippet.title,
					description : obj.snippet.description,
					img: obj.snippet.thumbnails.high.url,
					toFullDescription :false,
					fullDescription: null
				}
			this.videos.push(video);
  		}
  	}

  	loadVideos(): Promise<any>{
		return this.youtubeService.getVideos().then(data => {
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
		this.isSearchResultEmpty = false;
		if (this.searchInput !== "") {
			this.videos = [];
			this.youtubeService.changeMode();
			this.youtubeService.getFoundVideos(this.searchInput).then(data => {
				if (data.length > 0)
					this.addVideos(data);
				else this.isSearchResultEmpty = true;

			});
		}
	}

	onInput(event) {
		if (this.searchInput === "") {
			this.toDefaultMode();
		}
		
	}

	toDefaultMode()	{
		this.isSearchResultEmpty = false;
		this.videos = [];
		this.youtubeService.changeMode();
		this.loadVideos();
	}

	onSeeMoreClick(video:any){
		
		if (!video.fullDescription)
			this.youtubeService.getVideoDescription(video.id).then(data => {
				let fullDescription = data.items[0].snippet.description;
				video.fullDescription = fullDescription;
				video.toFullDescription = !video.toFullDescription;
			})
		else video.toFullDescription = !video.toFullDescription;
	}
}
