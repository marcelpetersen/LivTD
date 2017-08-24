import { Component, ViewChild, ElementRef, ViewChildren, QueryList, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { NavController, NavParams, Content, ActionSheetController, Platform } from 'ionic-angular';
import { FirebaseProvider } from '../../providers/firebaseProvider'
import { StorageProvider } from '../../providers/storage'
import { CameraProvider } from '../../providers/camera'
import { Events } from 'ionic-angular';
import { Clipboard } from '@ionic-native/clipboard';
import { AlertController } from 'ionic-angular';
import { AlertProvider } from '../../providers/alert'
import { ScrollProvider } from '../../providers/scroll'
import { FileTransferProvider } from '../../providers/fileTransfer';
import {InAppBrowserProvider} from '../../providers/inAppBrowserProvider'

@Component({
  selector: 'page-tabChat',
  templateUrl: 'tabChat.html'
})

export class tabChatPage implements OnDestroy {

	@ViewChild(Content) content: Content;
	@ViewChild('sidebar') sidebar: ElementRef;
    @ViewChildren('task') taskCards: QueryList<ElementRef>; 

	userID: string;
	displayName: string;
	recieverID: string = "";
	chatRef: any;
	messageText: string = "";
	pictureURL: string = null;
	userPhotoURL: string;
	messageStory: Array<any> = [];
	chatUsers: any = {};
	public eventMock;
  	public eventPosMock;
	isHistoryInitComplete: boolean = false;
	isInitCompleteInit: boolean = false;
	isSending: boolean = false;
	isLoading: boolean = false;
	limitCount: any = 30;
	prevScroll: any = 0;
	access_level: boolean;

	isEndOfHistory: boolean ;
	
	constructor(public navCtrl: NavController, private scrollFix: ScrollProvider, public element: ElementRef, public navParams: NavParams, public firebaseProvider: FirebaseProvider, public storageProvider: StorageProvider,public inAppBrowserProvider: InAppBrowserProvider, 
		public cameraProvider: CameraProvider, public plt: Platform, private events: Events, public clipboard: Clipboard, public actionSheetController: ActionSheetController, public alertProvider: AlertProvider, public fileTransferProvider: FileTransferProvider, private ref: ChangeDetectorRef) {

		this.isEndOfHistory = false;
		this.storageProvider.getItem('curent_user').then(data => {
			this.userID = data.id
			this.userPhotoURL = data.photoURL;
			this.displayName = data.displayName;		

			this.firebaseProvider.getUserRef(this.userID).child('access_level').on('value', data => {
				this.access_level = data.val();		
			})
			this.chatRef = this.firebaseProvider.getChatRef();

			this.chatRef.on('child_added', data => {
				if (this.isHistoryInitComplete) {
					this.messageStory.push(this.addMessage(data.val()));
					this.ref.detectChanges();
					setTimeout(() => {

						if(this.content._scroll)
							this.content.scrollToBottom(0);
					}, 500)
				}
			});

			this.chatRef.orderByChild("date").limitToLast(this.limitCount).once('value', data => {
				this.initMessageStory(data);
			});
		});
    }

    ngAfterViewInit() {
       // this.isInitCompleteInit = false;
    }

	ngOnDestroy() {
		this.ref.detach(); // try this
		// this.authObserver.unsubscribe(); // for me I was detect changes inside "subscribe" so was enough for me to just unsubscribe;
	}

    // openEmoji() {
    // 	var result = this.element.nativeElement.querySelector('[_nghost-c0] .emoji-search[_ngcontent-c0]');
    // 	result.hidden = !result.hidden;
    // }

    scrollHandler(event) {
  //   	if(!this.isLoading) {
	 //    	var result = this.element.nativeElement.querySelector('.spinner-chat');
		//    if(event.scrollTop <= 100) {
		//    		this.prevScroll = event.scrollTop;
		//    		result.style.display = 'block';
		//    		this.isLoading = true;
		//    		this.loadMore(result);
		//    } else {
		//    		result.style.display = 'none';
		//    }
		// }
    }

	initMessageStory(snapshot: any) {

		let snapshotObj = snapshot.val();

		if (snapshotObj) {
			this.alertProvider.presentLoadingCustom();
			var keyNames = Object.keys(snapshotObj);

			if(keyNames.length === 0){
				this.isHistoryInitComplete = true;
				this.isInitCompleteInit = true;
			}
			for (let name of keyNames) {
				this.messageStory.push(this.addMessage(snapshotObj[name]));
				if(keyNames.indexOf(name)===keyNames.length-1){
						this.isHistoryInitComplete = true;
						this.isInitCompleteInit = true;
						this.alertProvider.dismissLoadingCustom();										
				}
			}
			
		}
		else {
			this.isHistoryInitComplete = true;
			this.isInitCompleteInit = true;
		}
		
    }

  	addMessage(data) {

		if( !this.chatUsers[data.senderID] ) {
			this.chatUsers[data.senderID] = {
				uid: data.senderID,
				displayName: "",
				photoURL: '../../assets/default.png'
			}

			this.firebaseProvider.getUserRef(data.senderID).once('value').then(snaphot => {
				if (snaphot.val()) {
					this.chatUsers[data.senderID].displayName = snaphot.val().displayName;
					this.chatUsers[data.senderID].photoURL = snaphot.val().photoURL;
				}						
			}, 	function(error) { 
				console.error(error);
			})
		}
		var urlRegex = /(https?:\/\/[^\s]+)/g;
		data.message = data.message.replace(urlRegex, function(url){
			data.link = url;
			return '<a>' + url + '</a>';
		})
		return data;
  	}

	sendMessage() {
		if (this.access_level) {
			let messageText = this.messageText.trim()
			if (messageText !== "" || this.pictureURL) {
				this.isSending = true;
				let message = {
					senderID: this.userID,
					recieverID: this.recieverID,
					message: messageText,
					date: this.firebaseProvider.getServerTimestamp(),
					pictureURL: this.pictureURL
				}
				this.chatRef.push(message);
				this.messageText = "";
				this.recieverID = "";
				this.pictureURL = null;
			}
		} else {
			this.alertProvider.presentCustomToast("We’re sorry. But you can’t contribute to the chat at this very moment.")
		}
	}

	uploadPhotoClick() {
		if (this.access_level) {
			this.storageProvider.getItem('pictureToPast').then(data => {
				let alert = this.cameraProvider.showChoiceAlert(this);
				if (data) {
					alert.addButton(
						{
							text: 'Past image',
								handler: () => {
								this.pictureURL = data;
								this.sendMessage();
							}
						})
				}
				alert.present();
			});
		}
	}

	imageReadyHandler(imageData:any) {
		this.firebaseProvider.uploadChatPhoto(imageData).then(url => {
			this.pictureURL = url;
			this.sendMessage();
		});
	}

	onMessagePress(message) {
		let messageSheet = this.actionSheetController.create({
			buttons: [{
				text: "Reply",
				icon: 'ios-mail-outline',
				handler: () => {
					this.recieverID = message.senderID;
					this.messageText = '@(' + this.chatUsers[message.senderID].displayName + '), ' + this.messageText;
				}
			},
			{
				text: "Copy",
				icon: 'ios-copy-outline',
				handler: () => {
					let msgToCopy = '@(' + this.chatUsers[message.senderID].displayName + '):' + '"' + message.message + '"';
					this.clipboard.copy(msgToCopy);
					this.alertProvider.presentCopyToast();
				}
			}]
		})
		if (message.pictureURL) {
			messageSheet.addButton({
				text: "Save Image",
				icon: 'ios-cloud-download-outline',
				handler:() => {
					this.fileTransferProvider.saveImage(message.pictureURL);
				}
			})
		}
		messageSheet.present();
	}

	scrollFunction() {
		// if( this.isSending ) {
		// 	this.content.scrollToBottom(0);
	 //    	this.isSending = false;
		// } else if( this.isInitCompleteInit) {
		// 	this.content.scrollToBottom(0);
		// 	this.isInitCompleteInit = false;
		// }
		if(this.isInitCompleteInit){
			this.content.scrollToBottom(0);
			this.isInitCompleteInit = false;
		}
    }

	doInfinite(event){		
		
		this.chatRef.orderByChild("date").endAt(this.messageStory[0].date).limitToLast(this.limitCount).once('value', data => {

			let snapshotObj = data.val();
			
			if (snapshotObj) {
				var keyNames = Object.keys(snapshotObj).sort().reverse();
				
				if (!keyNames||keyNames.length == 1){
					event.complete();
					this.isEndOfHistory = true;
				}
				else
				for (let name of keyNames) {
					if (name !== keyNames[0])
						this.messageStory.unshift(this.addMessage(snapshotObj[name]));
					if (name === keyNames[keyNames.length - 1]) {						
						event.complete();

					}
				}
			} else {
				event.complete();

			}
		});
		
	}

	openURL(message){	
		if(message.link){
			this.inAppBrowserProvider.openURL(message.link);
		}
	}
	
}




