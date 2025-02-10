import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { ReactiveFormsModule } from '@angular/forms';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: [],
  imports: [ReactiveFormsModule],
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService
  ) {
    this.loginForm = this.fb.group({
      email: ['kevin@gmail.com', [Validators.required, Validators.email]],
      password: ['adminadmin1', Validators.required]
    });
  }

  ngOnInit(): void {}

  get f() {
    return this.loginForm.controls;
  }

  onSubmit(): void {
    if (this.loginForm.invalid) {
      return;
    }

    // Accede a los controles con la notación de corchetes
    const email = this.f['email'].value;
    const password = this.f['password'].value;

    this.authService.authenticate(email, password).subscribe({
      next: (res) => {
        console.log(res);
       localStorage.setItem('token', res.token);
        this.router.navigate(['/dashboard']);
      },
      error: (e) => console.error(e)
    });
  }
}
