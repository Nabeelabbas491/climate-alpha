import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MustMatch } from 'app/shared/directives/must-match.validator';
import { ApiService } from 'app/shared/services/api.service';
import { AuthService } from 'app/shared/services/auth.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent {

  current_password: string = ''
  new_password: string = "";
  repeatPassword: string;

  constructor(private api: ApiService,
    private toastr: ToastrService,
    private router: Router,
    public authService: AuthService) { }

  updatePassword() {
    let data = { current_password: this.current_password, new_password: this.new_password }
    this.api.post('auth/password_update/', data).subscribe((response) => {
      this.toastr.success(response.message)
      this.authService.logout(null)
    }, (error) => {
      this.toastr.error(error.error.payload.errors)
    })

  }

}
