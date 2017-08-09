import { NavController, Slides } from 'ionic-angular';
import { Component, ViewChild, ElementRef } from '@angular/core';
import { LoginPage } from '../../pages/auth/login/login';

@Component({
	selector: 'welcome-page',
	templateUrl: 'welcome.html'
})

export class WelcomePage  {

	@ViewChild(Slides) slides: Slides;
	images: Array<any>;

	constructor(public navController: NavController, public element: ElementRef) {
		this.images = Array(
			{ "coverURL": "assets/1Pq7MMCtQqitpEn7T5GG_liv2.png" },
			{ "coverURL": "assets/EsuWeH8qQkqWyCHypQNy_LIVgetstarted1.jpg"},
			{ "coverURL": "assets/mb9whvKARhqiiNMZWfk0_LIVchat.png" },
			{ "coverURL": "assets/qSf6MlRTTzKezlUqNePz_livphone1.png" }
		);

	}

	onGetStartedClick(){
		this.navController.setRoot(LoginPage);
	}

	slideChanged() {
		var result = this.element.nativeElement.querySelector('.skip-button');
		if(this.slides.isEnd()) {
			result.style.display = 'none';
		} else {
			result.style.display = 'block';
		}
	}
}