import { Component, OnInit } from '@angular/core';
import{ ActivatedRoute, Router} from '@angular/router';
import { User } from '../shared/user.model';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css'],
  providers: []
})
export class RegistrationComponent implements OnInit {
  user: User;
  constructor( private route:ActivatedRoute, private router: Router ) { }
  ngOnInit() {
  }

}
