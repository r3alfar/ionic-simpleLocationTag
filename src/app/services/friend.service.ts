/* tslint:disable */
import { Injectable } from '@angular/core';
import {AngularFireDatabase, AngularFireList} from '@angular/fire/database';
import firebase from 'firebase';
import User = firebase.User;

@Injectable({
  providedIn: 'root'
})
export class FriendService {
    private dbPath = '/user';
    userRef: AngularFireList<User> = null;

    constructor(private db: AngularFireDatabase) {
        this.userRef = db.list(this.dbPath);
    }

    getAll(): AngularFireList<User> {
        return this.userRef;
    }

    create(key: string, value: any): any {
        return this.userRef.set(key, value);
    }

    update(key: string, value: any): Promise<void> {
        return this.userRef.update(key, value);
    }
}
