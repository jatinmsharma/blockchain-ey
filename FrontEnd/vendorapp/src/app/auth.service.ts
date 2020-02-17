import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Http, HttpModule } from '@angular/http';

interface myData {
  success: boolean,
  message: string
}
@Injectable()
export class AuthService {
  private loggedInStatus = JSON.parse(localStorage.getItem('loggedIn') || 'false')
  constructor(private http: HttpClient) { }
  setLoggedIn(value: boolean, publicKey: string, privatekey: string, userID: string) {
    // this.setLoggedIn()
    this.loggedInStatus = value
    localStorage.setItem('loggedIn', 'true')
    localStorage.setItem('public', publicKey)
    localStorage.setItem('private', privatekey)
    localStorage.setItem('userID', userID)
  }
setuserid(uid: string)
{
  localStorage.setItem('useridstore',uid)
}
  setLogout() {
    this.loggedInStatus = false
    //localStorage.setItem('loggedIn', 'false')
    // localStorage.clear()
    // this.loggedInStatus = value
    localStorage.setItem('loggedIn','false')
    localStorage.removeItem('publicKey')
    localStorage.removeItem('privateKey')
    localStorage.removeItem('userID')
    localStorage.removeItem('loggedIn')
    localStorage.removeItem('name')
    localStorage.removeItem('private')
    localStorage.removeItem('public')
    localStorage.clear()
    // window.alert("logout1")
  }
  username(){
    console.log(localStorage)
  }
  // get isLoggedOut(){
  //   return JSON.parse(localStorage.getItem('loggedIn') || this.loggedInStatus.toString())
  // }

  // get 
 isLoggedIn() {
    return JSON.parse(localStorage.getItem('loggedIn') || this.loggedInStatus.toString())
  }

  getUserDetails(username, password) {
    return this.http.post<myData>('/api/auth.php', {
      username,
      password
    })
  }

}
