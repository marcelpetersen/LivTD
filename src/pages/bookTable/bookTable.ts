import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Http, Headers } from '@angular/http';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EmailValidator } from "../../validators/email";
import { PostmarkProvider } from '../../providers/postmarkProvider'
import { AlertProvider } from '../../providers/alert';



@Component({
  selector: 'page-book-table',
  templateUrl: 'bookTable.html'

})

export class BookTablePage {
 	
  public bookTableForm: FormGroup;
  phone: string = "+1 305 674 4680";
  isEmailValid: boolean = true;
  isDateValid: boolean = true;
  public mask: Array<string | RegExp>
  minDate: string;
  maxDate: string;
  // public mask = ['(', /[1-9]/, /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, ' ', /\d/, /\d/, /\d/, /\d/];

  constructor(public navCtrl: NavController, public navParams: NavParams, public http: Http,
    formBuilder: FormBuilder, public postmarkProvider: PostmarkProvider, public alertProvider: AlertProvider) {
    
    
  this.mask = ['+', /\d{1}/, ' ', '(', /[1-9]/, /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/];

    this.bookTableForm = formBuilder.group({
       email: ['', Validators.compose([Validators.required,EmailValidator.isValid])],
       phoneNumber : ['', Validators.required],
       females: ['', Validators.required],
       males: ['', Validators.required],
       date: ['', Validators.required]
     })
    this.initDateInterval();
  }

  submit() {
    this.isDateValid = new Date(this.bookTableForm.value.date).getTime() >= new Date().getTime();
    this.isEmailValid = this.bookTableForm.controls.email.valid;
    if(this.isDateValid && this.bookTableForm.valid){
    this.alertProvider.presentLoadingCustom();
    this.postmarkProvider.sendBookTableMessage(this.bookTableForm.value.date, this.bookTableForm.value.females
        , this.bookTableForm.value.males, this.bookTableForm.value.phoneNumber, this.bookTableForm.value.email).then((data)=> {
          this.alertProvider.dismissLoadingCustom();
          this.alertProvider.presentAlertWithTittle("Thank you for your table inquiry. A VIP host will reach out to you shortly after to confirm reservation.");
          this.bookTableForm.reset();
        });
     }
      
  }

  initDateInterval(){
    let today = new Date();
    this.minDate = today.toISOString().substring(0, 10);
    let maxDateObj = today;
    maxDateObj.setFullYear(today.getFullYear() + 5);
    this.maxDate = maxDateObj.toISOString().substring(0, 10);
    this.bookTableForm.get('date').setValue(this.minDate);
  }
  
  
}
 
