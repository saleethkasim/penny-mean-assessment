import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class Login {
  loginForm;
  loading = false;

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  get email() { return this.loginForm.get('email'); }
  get password() { return this.loginForm.get('password'); }

  onSubmit() {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.loading = true;
    const formData = {
      email: this.email?.value ?? '',
      password: this.password?.value ?? ''
    };

    this.auth.login(formData).subscribe({
      next: (res) => {
        this.loading = false;
        console.log('✅ Login successful:', res);

        if (res.token && res.user) {
          localStorage.setItem('authToken', res.token);
          localStorage.setItem('user', JSON.stringify(res.user));
          localStorage.setItem('loginTime', Date.now().toString());
        }

        alert('Login successful!');
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        this.loading = false;
        console.error('❌ Login failed:', err);
        alert(err?.error?.message || 'Login failed. Please check your credentials.');
      }
    });
  }
}
