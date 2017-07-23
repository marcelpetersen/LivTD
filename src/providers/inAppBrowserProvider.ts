import { Injectable } from '@angular/core';
import { AlertProvider } from '../providers/alert';

declare var cordova;

@Injectable()
export class InAppBrowserProvider {

	constructor(public alertProvider: AlertProvider) {
		// code...
	}

	openURL(url:string) {
		this.alertProvider.presentLoadingCustom();

		var ref = cordova.ThemeableBrowser.open(url, '_blank', {

			toolbar: {
				height: 56,
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
			hidden: true,
			"browserProgress": {
	            "showProgress": true,
	            "progressBgColor": "#016585",
	            "progressColor": "#FFAA16"
	        },
            backButtonCanClose: false,
            hardwareback: false,
            shouldPauseOnSuspend: true
            
		})
		// .addEventListener('backPressed', function(e) {
		//     console.log('backPressed');
		// }).addEventListener('forwardPressed', function(e) {
		//     console.log('forwardPressed');
		// }).addEventListener('closePressed', function(e) {
		//     ref.close();
		// })

		ref.addEventListener('loadstart', function() {
    		
		});
		var loader_ = this.alertProvider;
		ref.addEventListener('loadstop', function() {
    		ref.show();
    		console.log(loader_);
    		loader_.dismissLoadingCustom();
		});
		ref.addEventListener('loaderror', function(params) {
    		var scriptErrorMesssage =
	       "alert('Sorry we cannot open that page. Message from the server is : "
	       + params.message + "');"

		    ref.close();
		    ref = undefined;
		});
	}
}