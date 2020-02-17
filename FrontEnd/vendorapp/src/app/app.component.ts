import { Component } from '@angular/core';
import { AuthService } from './auth.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'VendorApp';
  constructor(private Auth: AuthService,private router: Router,) {
  }


setlogout(){
this.Auth.setLogout();
this.router.navigate(['/home']);
}

}
