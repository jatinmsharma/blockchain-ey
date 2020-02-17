import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders } from '@angular/common/http';
import { Observable} from 'rxjs';


interface myData {
  message: string,
  success: boolean
}

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient){ }


  getUsers(){
    return this.http.get('./assets/info.json',{ responseType: 'text'})
  }

getemployee(){
  return this.http.get('./assets/employeedetails.json',{ responseType: 'text'})
}

  getSomeData(){
    return this.http.get<myData>('/api/database.php')
  }

}
