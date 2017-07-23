import { Injectable } from '@angular/core';
import firebase from 'firebase';
import { Facebook } from '@ionic-native/facebook';
import { StorageProvider } from '../providers/storage';

@Injectable()
export class FirebaseProvider {
  
  public userProfile : firebase.database.Reference;
  public userData :any;
  public defaultPhotoURL : string = 'https://firebasestorage.googleapis.com/v0/b/liv-app-8af89.appspot.com/o/LIV_logo_White.png?alt=media&token=1b632aec-f59d-4d8c-8100-56ffcc778433';
  public defaultMusicPreference = {
            edm:false,
            hipHop:false,
            latin:false,
            underground:false
          };

  constructor(public facebook: Facebook, public storageProvider: StorageProvider) {
    this.userProfile = null;
  }


  getUserProfileRef(): firebase.database.Reference {
    if(!this.userProfile) {
      var currentUser = firebase.auth().currentUser;
      if (!currentUser) return null;
      this.userProfile = firebase.database().ref('/userProfile/' + currentUser.uid);
    }
    return this.userProfile;
  }

  /*
  //
  //
  !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!Authentication methods!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
  //
  //
  */

  signupUser(name:string, domTimeStamp:number, email:string, password: string): firebase.Promise<any> {
    return firebase.auth().createUserWithEmailAndPassword(email, password)
      .then(newUser => {
        this.saveDataToDataBase(name, domTimeStamp, email, this.defaultPhotoURL);
        this.saveDataToLocalStorage(name, domTimeStamp, email, this.defaultPhotoURL, "", "", this.defaultMusicPreference);
      });
  }

  loginUser(email: string, password: string): firebase.Promise<any> {
    return firebase.auth().signInWithEmailAndPassword(email, password).then(() => {
      firebase.database().ref('/userProfile/').child(firebase.auth().currentUser.uid).once('value',(snapshot) => {
        var musicPreference = snapshot.val().musicPreference;
        this.saveDataToLocalStorage(snapshot.val().displayName, snapshot.val().domTimeStamp, snapshot.val().email, 
          snapshot.val().photoURL, snapshot.val().phoneNumber, snapshot.val().zipCode, musicPreference);
      })
    });
  }

  resetPassword(email: string): firebase.Promise<void> {
    return firebase.auth().sendPasswordResetEmail(email);
  }

  logInUserWithFacebook(): firebase.Promise<any> {
    return this.facebook.login(['email']).then((response) => {
        const facebookCredential = firebase.auth.FacebookAuthProvider.credential(response.authResponse.accessToken);
        return firebase.auth().signInWithCredential(facebookCredential).then((success) => {
              var displayName = success['displayName'];
              var photoURL = success['photoURL'];
              var phoneNumber = "";
              var zipCode = "";
              var dob = 0;
              var musicPreference = this.defaultMusicPreference;
             
              if(photoURL==="") 
                photoURL = this.defaultPhotoURL;

              firebase.database().ref('/userProfile/').child(firebase.auth().currentUser.uid).once('value',(snapshot) => {
                 
                if(!snapshot.exists()){
                  this.saveDataToDataBase(success['displayName'], 0, success['email'], photoURL);
                } else {
                  displayName = snapshot.val().displayName;
                  photoURL = snapshot.val().photoURL;
                  phoneNumber = snapshot.val().phoneNumber;
                  zipCode = snapshot.val().zipCode;
                  dob = snapshot.val().domTimeStamp;
                  musicPreference = snapshot.val().musicPreference;                  
                  }
                this.saveDataToLocalStorage(displayName,dob,success['email'],photoURL,phoneNumber,zipCode,musicPreference);
              });    
            
        });   
      }).catch((error:any) => {
          return error;
        });    
  }

  saveDataToLocalStorage(name:string, domTimeStamp:number, email:string, photoURL:string, phoneNumber:string, zipCode:string, musicPreference:any):void {
    var key = 'curent_user';
    var data = {
        displayName : name,
        email : email,
        dob : domTimeStamp,
        photoURL : photoURL,
        id : firebase.auth().currentUser.uid,
        phoneNumber:phoneNumber,
        zipCode:zipCode,
        musicPreference: musicPreference
      };     
    this.storageProvider.setItem(key,data);
  }

  saveDataToDataBase(name:string, domTimeStamp:number, email:string, photoURL: string) {
    var currentUser = firebase.auth().currentUser;
    if(currentUser!==null) {
      firebase.database().ref('/userProfile').child(currentUser.uid)
            .set({
              email : email,
              displayName : name,
              domTimeStamp : domTimeStamp,
              registrationDateStamp : new Date().getTime(),
              photoURL : photoURL,
              phoneNumber : "",
              zipCode : "",
              musicPreference : {
                edm:false,
                hipHop:false,
                latin:false,
                underground:false
              }
          });
    }
  }

  logOutUser():firebase.Promise<any> {
    this.userProfile = null;
    return firebase.auth().signOut().then(() => {
      this.storageProvider.clear();
    });
  }

/*
//
//
!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!Data editing methods!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
//
//
*/

  updatePhotoURL(newPhotoURL:string):firebase.Promise<void> {
    var profile = this.getUserProfileRef();
    return profile.update( {
      photoURL: newPhotoURL
    }).then(() => {
        this.storageProvider.getItem('curent_user').then((data) => {
          var newData = data;
          newData['photoURL'] = newPhotoURL;
          this.storageProvider.clear().then(() => {
            this.storageProvider.setItem('curent_user',data);
          })
        })
      });
  }

  updateUserData(userData:any):firebase.Promise<void> {
    var profile = this.getUserProfileRef();
    return profile.update( {
      displayName : userData.displayName,
      photoURL : userData.photoURL,          
      phoneNumber : userData.phoneNumber,
      zipCode : userData.zipCode,
      musicPreference : userData.musicPreference
    }).then(() => { 
        this.storageProvider.clear().then(() => {
          this.storageProvider.setItem('curent_user', userData);
        })
      
      });
  }

  updateEmail(newEmail: string): firebase.Promise<any> {
    var currentUser = firebase.auth().currentUser;
    return currentUser.updateEmail(newEmail).then( user => {
      var profile = this.getUserProfileRef();
      profile.update({ email: newEmail }).then(() => {
        this.storageProvider.getItem('curent_user').then((data) => {
          var newData = data;
          newData['email'] = newEmail;
          this.storageProvider.clear().then(() => {
            this.storageProvider.setItem('curent_user',data);
          })
        })
      });
    });
  }

/*
//
//
!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!Storage methods!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
//
//
*/
  
  uploadPhoto(imageData:any):any {
    var newUserPhotoURL = 'data:image/jpeg;base64,' + imageData;
    let storageRef = firebase.storage().ref();
    const filename = Math.floor(Date.now() / 1000);
    const imageRef = storageRef.child(`/${filename}.jpg`);

    imageRef.putString(newUserPhotoURL, firebase.storage.StringFormat.DATA_URL).then((snapshot) => {
      imageRef.getDownloadURL().then((url: any) => {
        this.updatePhotoURL(url);
      });
      console.log("Uploaded!");
    });
  }

}
