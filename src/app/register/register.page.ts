/* tslint:disable */
import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {NavController, ToastController} from '@ionic/angular';
import {AuthService} from '../services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {
  registerForm: FormGroup;

  validationMessages = {
    name : [
      {type: 'required', message: 'Name is required.'},
    ],
    'email' : [
      {type: 'required', message: "Email is required."},
      {type: 'pattern', message: "Enter a valid email."},
    ],
    'password' : [
      {type: 'required', message: "Password is required."},
      {type: 'minLength', message: "Password must be at least 6 characters long."},
    ]
  }

  constructor(
      private navCtrl: NavController,
      private authServ: AuthService,
      private formBuilder: FormBuilder,
      public toastController: ToastController
  ) { }

  ngOnInit() {
    this.registerForm = this.formBuilder.group({
      name: new FormControl('', Validators.compose([
        Validators.required,
        Validators.minLength(1)
      ])),
      email: new FormControl('', Validators.compose([
        Validators.required,
        Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')
      ])),
      password: new FormControl('', Validators.compose([
        Validators.required,
        Validators.minLength(6)
      ]))
    });
  }

  registerUser(value) {
    this.authServ.registerUser(value).then(
        res => {
          console.log(res);
          this.presentToast("Register success! Please log in.","success");
          this.navCtrl.navigateBack('login')
        },
        err => {
          console.log(err);
          this.presentToast(err,"danger");
        }
    );
  }

  goToLoginPage() {
    this.navCtrl.navigateBack('login')
  }

  async presentToast(message, color) {
    const toast = await this.toastController.create({
      message: message,
      color: color,
      duration: 1000,
    });
    toast.present();
  }
}
