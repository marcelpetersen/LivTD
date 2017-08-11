import { Component } from '@angular/core';
import { NavController, AlertController } from 'ionic-angular';
import { FirebaseProvider} from "../../../providers/firebaseProvider";
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EmailValidator } from "../../../validators/email";
import { HomePage } from '../../../pages/home/home';
import { RegistrationPage } from  '../../../pages/auth/registration/registration';
import { ModalController } from 'ionic-angular';
import { ResetPasswordPage } from '../../../pages/auth/resetPassword/resetPassword';
import { AlertProvider } from '../../../providers/alert';


@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})

export class LoginPage {
	
	public loginForm : FormGroup;
	public userPassword : string;
  public errorMessage = null;

	constructor(public navCtrl: NavController, public  firebaseProvider: FirebaseProvider, public formBuilder: FormBuilder,
    public alertProvider: AlertProvider, public modalCtrl: ModalController, public alertController: AlertController) {
    this.userPassword = "";
		this.loginForm = formBuilder.group({
          email: ['',Validators.compose([Validators.required,EmailValidator.isValid])],
          pswrd: ['', Validators.compose([Validators.required,Validators.minLength(6)])]       
        }
      );
	}

	signInUser():void {
    this.errorMessage = null;
    this.alertProvider.presentLoadingCustom();
		this.firebaseProvider.loginUser(this.loginForm.value.email, this.userPassword).then((data)=> {
      this.alertProvider.dismissLoadingCustom();

  			this.navCtrl.setRoot(HomePage);
		    }).catch((error:any) => {
            var errorMessage:string;
            switch (error.code) {
              case ("auth/invalid-email"):
                errorMessage = "Please enter a valid e-mail";
                break;
              case "auth/user-not-found":
              	errorMessage = "User not found";
              	break;
              case "auth/wrong-password":
                errorMessage = "Wrong password";
                break;
              default:
                errorMessage = "Something went wrong";
                break;
            }
            this.alertProvider.dismissLoadingCustom();
            this.errorMessage = errorMessage;
		});
	}

	

	onCreateNewAccountClick():void {
		this.navCtrl.setRoot(RegistrationPage);
	}

	onForgotPasswordClick():void {
    let alert = this.alertController.create({
      title: ' Forgot Password?',
      message: 'Enter your email so we can send you a reset password link.',
      inputs: [
        {
          name: 'email',
          placeholder: 'Email'
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
        },
        {
          text: 'Send',
          handler: (data) => {
            this.errorMessage = null;
            this.alertProvider.presentLoadingCustom();
            this.firebaseProvider.resetPassword(data.email).then(() => {
              this.alertProvider.resetPasswordToast("Reset instructions sent. Please check your e-mail.");
              this.alertProvider.dismissLoadingCustom();
            }).catch((error: any) => {
              var errorMessage: string;
              switch (error.code) {
                case ("auth/invalid-email"):
                  errorMessage = "Please enter a valid e-mail.";
                  break;
                case "auth/user-not-found":
                  errorMessage = "User not found";
                  break;
                default:
                  errorMessage = "Something went wrong";
                  break;
              }
              this.alertProvider.dismissLoadingCustom();
              this.alertProvider.resetPasswordToast(errorMessage);
            });
          }
        }
      ]
    });
    alert.present();
	}

	onLogInWithFacebookClick():void {
    this.errorMessage = null;
    this.alertProvider.presentLoadingCustom();
		this.firebaseProvider.logInUserWithFacebook().then((data) => {
          this.alertProvider.dismissLoadingCustom();
          if (data===undefined)
            this.navCtrl.setRoot(HomePage);
          else this.errorMessage = 'Something went wrong';
		}).catch((error: any) => {
			    var errorMessage:string;
			    switch (error.code) {
            	    case "auth/user-not-found":
              	    errorMessage = "User not found";
              	    break;
              	  case "auth/wrong-password":
                    errorMessage = "Wrong password";
                    break;
              	  default:
                    errorMessage = "Something went wrong";
                    break;
            }
          this.alertProvider.dismissLoadingCustom();
          this.errorMessage = errorMessage;
		});
	}

	
}