import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { StorageProvider } from '../../providers/storage';
import { FirebaseProvider } from '../../providers/firebaseProvider';
import { AlertProvider } from '../../providers/alert';
import { CameraProvider } from '../../providers/camera';
import { LoginPage } from '../../pages/auth/login/login';
import { EmailValidator } from "../../validators/email";
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Events } from 'ionic-angular';

@Component({
  selector: 'page-my-profile',
  templateUrl: 'myProfile.html'
})

export class MyProfilePage {

  userData : any;
  userPhoto : any;
  imageData: any;
  changedMusicPreference : any;
  public profileForm : FormGroup;
  isEdit:boolean = false;
  public mask = ['(', /[1-9]/, /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, ' ', /\d/, /\d/, /\d/, /\d/];

  constructor(public navCtrl: NavController, public storageProvider: StorageProvider, public firebaseProvider: FirebaseProvider,
  public alertProvider: AlertProvider, public formBuilder: FormBuilder, public cameraProvider: CameraProvider, public events: Events) {
    
    this.changedMusicPreference = null;
    this.isEdit = false;
    this.userData = {
        displayName:"",
        email:"",
        dob:0,
        photoURL:"",
        id:"",
        phoneNumber:"",
        zipCode:"",
        musicPreference: {
          edm:false,
          hipHop:false,
          latin:false,
          underground:false
          }
      };
    this.userPhoto = "";
    this.profileForm = formBuilder.group({
        name: ['',Validators.compose([Validators.required,
        Validators.maxLength(45),Validators.pattern("[a-z A-Z]*")])],
        email: ['',Validators.compose([Validators.required,EmailValidator.isValid])], 
        phoneNumber: [''],
        zipCode: ['']       
      }
    );
 
    this.storageProvider.getItem('curent_user').then((data:any) => {
      this.userData = data;
      this.setInputsData();
    }).catch((error)=>{
        console.log("MyProfilePage: Getting data error:"+error);
    });

    events.subscribe('user:changed', (name, photoURL) => {
      this.userData.photoURL = photoURL;
      this.userPhoto = photoURL;
    });  

    events.subscribe('changedPhoto', (imageData, toUpload: boolean) => {
      if(!toUpload){
        this.userPhoto = 'data:image/jpeg;base64,' + imageData;
        this.imageData = imageData;
      }
    });

  }

  logOutUser() {
    this.firebaseProvider.logOutUser().then(() => {  
      this.navCtrl.setRoot(LoginPage);
    }).catch((error) => {
        console.log("MyProfilePage: logout error: " + error);
    })
  }

  editProfile() {
    this.isEdit = true;  
    var strObj = JSON.stringify(this.userData.musicPreference);
    this.changedMusicPreference = JSON.parse(strObj);    
  }

  saveProfile() {
    if(this.profileForm.valid) {   
      this.isEdit = false;   
      var strObj = JSON.stringify(this.userData);
      var changedUserData = JSON.parse(strObj);

      changedUserData.displayName = this.profileForm.value.name;
      changedUserData.phoneNumber = this.profileForm.value.phoneNumber;
      changedUserData.zipCode = this.profileForm.value.zipCode;
      changedUserData.musicPreference = this.changedMusicPreference;
      changedUserData.photoURL = this.userPhoto;

      this.firebaseProvider.updateUserData(changedUserData).then(()=> {
        if(this.userData.email !== this.profileForm.value.email)
          this.firebaseProvider.updateEmail(this.profileForm.value.email).then(() => {
              this.userData.email = this.profileForm.value.email;
              this.setInputsData();
            }).catch(()=> {
                this.alertProvider.presentAlertWithTittle('Failed to save email');
              });
        if (this.userPhoto !== this.userData.photoURL)
          this.firebaseProvider.uploadPhoto(this.imageData);       
        this.userData = changedUserData;
        this.changedMusicPreference = null;
        this.alertProvider.presentAlertWithTittle('Data saved!');      
        this.setInputsData();

        }).catch((error:any) => {
            this.alertProvider.presentAlertWithTittle('Failed to save data');
            console.log(error);
         });

    } else {
      this.alertProvider.presentAlertWithTittle('Some inputs are invalid');
      }
  }

  onMusicPreferenceClick() {
    var presentedData = this.isEdit ? this.changedMusicPreference : this.userData.musicPreference; 
    let alert = this.alertProvider.alertCtrl.create( {
        title: 'Music Preference',
        inputs: [
          {
            name: 'edm',
            label: 'EDM',
            type: "checkbox",
            value: "edm",
            disabled: !this.isEdit,
            checked: presentedData.edm
          },
          {
            name: 'hipHop',
            label: 'Hip-Hop/Open Format',
            type: "checkbox",
            value: "hipHop",
            disabled: !this.isEdit,
            checked: presentedData.hipHop         
          },
          {
            name: 'latin',
            label: 'Latin',
            type: "checkbox",
            value: "latin",
            disabled: !this.isEdit,
            checked: presentedData.latin      
          },
          {
            name: 'underground',
            label: 'Underground',
            type: "checkbox",
            value: "underground",
            disabled: !this.isEdit,
            checked: presentedData.underground    
          }
         ],
         buttons: [
                  {
                    text: 'Cancel',
                    role: 'cancel',
                  },
                  {
                    text: 'Ok',
                    handler: (data) => {
                      if(this.isEdit)
                        for(let i=0; i<data.length; i++ )
                          this.changedMusicPreference[data[i]] = true;
                      }
                  }
                ]
    });
    alert.present(); 
  }

  onChengePhotoClick() {
    if(this.isEdit)
      this.cameraProvider.showChoiceAlert(false);
  }

  cancelChanges() {
    this.isEdit = false;
    this.changedMusicPreference = null;
    this.setInputsData();
  }



setInputsData() {
  this.profileForm.get('name').setValue(this.userData.displayName);
  this.profileForm.get('email').setValue(this.userData.email);
  this.profileForm.get('phoneNumber').setValue(this.userData.phoneNumber);
  this.profileForm.get('zipCode').setValue(this.userData.zipCode);
  this.userPhoto = this.userData.photoURL;
}

}