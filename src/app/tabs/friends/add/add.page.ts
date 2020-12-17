import { Component, OnInit } from '@angular/core';
import {AuthService} from '../../../services/auth.service';
import {FriendService} from '../../../services/friend.service';
import {LoadingController, ToastController} from '@ionic/angular';
import {map} from 'rxjs/operators';

@Component({
  selector: 'app-add',
  templateUrl: './add.page.html',
  styleUrls: ['./add.page.scss'],
})
export class AddPage implements OnInit {
  searchValue: string;
  idUser: string;
  userData: any;
  usersData: any;
  userFriends: any[] = [];
  searchedUserData: any;
  boolUserFound = false;
  boolUserIsFriend = false;

  constructor(
      private authService: AuthService,
      private userService: FriendService,
      private toastCtrl: ToastController,
      private loadingCtrl: LoadingController
  ) { }

  ngOnInit() {
    this.getIdUser();
  }

  getIdUser(){
    this.authService.userDetails().subscribe(res => {
      if (res !== null){
        this.idUser = res.uid;
        this.getUsersData();
      }
    }, err => {
      console.log(err);
    });
  }

  getUserData(){
    this.userData = this.usersData.find(user => {
      return user.key === this.idUser;
    });
    if (this.userData.friends){
      this.userFriends = this.userData.friends;
    }
  }

  getUsersData(){
    this.userService.getAll().snapshotChanges().pipe(
        map(changes =>
            changes.map(c => ({key: c.payload.key, ...c.payload.val()}))
        )
    ).subscribe(data => {
      this.usersData = data;
      this.getUserData();
    });
  }

  async presentToast(toastMessage: string, colorMessage: string) {
    const toast = await this.toastCtrl.create({
      message: toastMessage,
      duration: 3000,
      position: 'bottom',
      color: colorMessage,
    });
    await toast.present();
  }

  async presentLoading(){
    const loading = await this.loadingCtrl.create({
      message: 'Menambahkan teman...',
      duration: 1000
    });
    await loading.present();

    const {role, data} = await loading.onDidDismiss();
    console.log('Loading dismissed!');
  }

  getSearchedUser(searchedEmail: string){
    return{...this.usersData.find(user => {
        return (user.email.toLowerCase() === searchedEmail.toLowerCase()) && (user.key !== this.idUser);
      })};
  }

  checkUserFriends(){
    const idxFriend = this.userFriends.indexOf(this.searchedUserData.key);
    if (idxFriend === -1){
      this.boolUserIsFriend = false;
    }
    else{
      this.boolUserIsFriend = true;
    }
  }

  searchUser(){
    if (this.searchValue !== ''){
      this.searchedUserData = this.getSearchedUser(this.searchValue);
      if (JSON.stringify(this.searchedUserData) === '{}'){
        this.boolUserFound = false;
        this.presentToast('User tidak ditemukan', 'danger');
      }
      else{
        this.boolUserFound = true;
        if (this.userData.friends){
          this.checkUserFriends();
        }
      }
    }
  }

  addFriend(){
    this.presentLoading().then(() => {
      this.userFriends.push(this.searchedUserData.key);
      this.userData.friends = this.userFriends;
      this.userService.update(this.idUser, this.userData);
      this.boolUserIsFriend = true;
      this.presentToast('User berhasil ditambahkan ke dalam Friend List', 'success');
    });
  }

  imageLoaded(event){
    const target = event.target || event.srcElement || event.currentTarget;
    const idAttr = target.attributes.id;
    const idValue = idAttr.nodeValue;
    const profileWidth = document.getElementById(idValue).offsetWidth;
    document.getElementById(idValue).style.height = profileWidth + 'px';
  }
}
