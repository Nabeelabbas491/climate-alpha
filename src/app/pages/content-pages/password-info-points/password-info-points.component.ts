import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-password-info-points',
  templateUrl: './password-info-points.component.html',
  styleUrls: ['./password-info-points.component.scss']
})
export class PasswordInfoPointsComponent implements OnInit {

  passwordBullets = [
    'must contain at least 12 characters including an uppercase letter, a lowercase letter, a number, and a special character',
    'cannot contain the username',
    'cannot be too similar to your personal information',
    'cannot be a commonly used password',
    'cannot be entirely numeric',
    'cannot be the same as the last 5 passwords ',
  ]
  constructor() { }

  ngOnInit(): void {
  }

}
