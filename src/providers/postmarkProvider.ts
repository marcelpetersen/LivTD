import { Http, Headers } from '@angular/http';
import { Injectable } from '@angular/core';

@Injectable()

export class PostmarkProvider   {
	
	headers: any;
	accessToken: any = '327fd15e-00c7-4d79-a319-78cf6727b37d';
	senderEmail:string = 'rachel@livnightclub.com';
	bookTableEmail:string = 'liv.app10.07@gmail.com';
	
	constructor(private http: Http) {
		this.headers = new Headers();
		this.headers.append('Accept', 'application/json');
		this.headers.append('Content-Type', 'application/json');
		this.headers.append('X-Postmark-Server-Token', this.accessToken);
	}

	sendDataToEmail(data): Promise<any> {
		return new Promise(resolve => {
			this.http
				.post('https://cors-anywhere.herokuapp.com/https://api.postmarkapp.com/email', data, {
					headers: this.headers
				})
				.subscribe(data => {
					resolve(data);
				});
		}) 
		
	}

	sendGreettingEmail(destinationEmail: string): Promise<any> {
		let data = {
			From: this.senderEmail,
			To: destinationEmail,
			Subject: 'LIVApp',
			HtmlBody: '<html><body><strong>Welcome to LIV app !!!</strong> </body></html>'
		}
		return this.sendDataToEmail(data);
	}

	sendBookTableMessage(date: Date, females: string, males: string, phoneNumber: string, email: string): Promise<any> {
		
		let htmlEmail =
		'<p>' + 'Book a Table' + '</p>' +
		'<p>' + 'Email: <b>' + email + '</b></p>' +
		'<p>' + 'Date: ' + date + '</p>' +
		'<p>' + 'Females: ' + females + '</p>' +
		'<p>' + 'Males: ' + males + '</p>' +
		'<p>' + 'Phone: ' + phoneNumber + '</p>';

		let data = {
			From: this.senderEmail,
			To: this.bookTableEmail,
			Subject: 'Book A Table',
			HtmlBody: htmlEmail
		}
		 return this.sendDataToEmail(data);
	}

}

