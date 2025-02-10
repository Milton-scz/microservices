import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Apollo } from 'apollo-angular';
import { Router } from '@angular/router';
import { authenticateUser } from 'src/app/graphql/users/graphql.mutation';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  loginForm!: FormGroup;
  submitted = false;
  successMessage: string | null = null;
  errorMessage: string | null = null;

  constructor(
    private apollo: Apollo,
    private fb: FormBuilder,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  ngOnInit(): void {}

  get f() {
    return this.loginForm.controls;
  }

  onSubmit(): void {
    this.submitted = true;
    if (this.loginForm.invalid) {
      return;
    }

    const { email, password } = this.loginForm.value;
    localStorage.clear();
    this.authenticate(email, password);
  }

  authenticate(email: string, password: string): void {
    console.log(email, password);

    this.apollo.mutate({
      mutation: authenticateUser,
      variables: {
        email,
        password
      }
    }).subscribe({
      next: (response: any) => {
        this.successMessage = 'Login exitoso!';
        this.errorMessage = null;
        const token = response.data.login;
        localStorage.setItem('accessToken', token);
        console.log('Token:', token);
        this.router.navigate(['/dashboard']);
      },
      error: (error) => {
        this.errorMessage = 'Error, intente nuevamente.';
        this.successMessage = null;
        console.error('Error:', error);
      }
    });
  }
}
