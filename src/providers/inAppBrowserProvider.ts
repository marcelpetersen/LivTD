import { Injectable } from '@angular/core';
declare var cordova;

@Injectable()
export class InAppBrowserProvider {

	constructor() {
		// code...
	}

	openURL(url:string) {

		var ref = cordova.ThemeableBrowser.open(url, '_blank', {
			statusbar: {
				color: '#282828'
			},
			toolbar: {
				height: 44,
				color: '#282828'
			},
			title: {
				color: '#ffffffff',
				showPageTitle: true
			},
			backButton: {
				wwwImage: 'assets/img/back_button.png',
				wwwImagePressed: 'assets/img/back_button.png',
				wwwImageDensity: 3,
				align: 'right'
			},
			forwardButton: {
				wwwImage: 'assets/img/foward_button.png',
				wwwImagePressed: 'assets/img/foward_button.png',
				wwwImageDensity: 3,
				align: 'right'
			},
			closeButton: {
				wwwImage: 'assets/img/close.png',
				wwwImagePressed: 'assets/img/close.png',
				wwwImageDensity: 3,
				align: 'left'
			},
			browserProgress: {
				showProgress: true,
				progressBgColor: '#282828',
				progressColor: '#22ECFC'
			}
            
		});
	}
}