import { Component } from '@angular/core';
import {  ViewController } from 'ionic-angular';
import { FirebaseProvider } from "../../../providers/firebaseProvider";
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EmailValidator } from "../../../validators/email";
import { AlertProvider } from '../../../providers/alert';


@Component({
  selector: 'page-reset-password',
  templateUrl: 'resetPassword.html'
})

export class ResetPasswordPage {
	
	public resetForm : FormGroup;
	public errorMessage: string = null;
	constructor(public viewController: ViewController, public  firebaseProvider: FirebaseProvider, public formBuilder: FormBuilder,
  public alertProvider: AlertProvider) {
		this.resetForm = formBuilder.group({
        email: ['', Validators.compose([ Validators.required, EmailValidator.isValid ])]       
        }
      );
	}

	resetPassword():void {
    this.errorMessage = null;
    this.alertProvider.presentLoadingCustom();
		this.firebaseProvider.resetPassword(this.resetForm.value.email).then(() => {
      this.alertProvider.presentAlertWithTittle("Reset instructions sent. Please check your e-mail.");
        this.alertProvider.dismissLoadingCustom();
        this.viewController.dismiss().catch(() => console.log('not dismissed'));
		    }).catch((error:any) => {
             var errorMessage:string;
              switch (error.code) {
                case ("auth/invalid-email"):
                  errorMessage = "Invalid email";
                  break;
                case "auth/user-not-found":
                	errorMessage = "User not found";
                	break;
                default:
                  errorMessage = "Something went wrong";
                  break;
              }
            this.alertProvider.dismissLoadingCustom();
            this.errorMessage = errorMessage;
		      });
	}



  onCancelClick():void {
    this.viewController.dismiss().catch(() => console.log('not dismissed'));
  }
}