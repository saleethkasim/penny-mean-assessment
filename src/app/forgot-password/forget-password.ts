import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="forgot-wrapper">
      <div class="forgot-box">
        <h2>Forgot Password</h2>
        <form [formGroup]="forgotForm" (ngSubmit)="onSubmit()">
          <div class="form-group">
            <label>Email</label>
            <input type="email" formControlName="email" placeholder="Enter your email" />
            <div class="error" *ngIf="email?.invalid && email?.touched">
              Please enter a valid email
            </div>
          </div>
          <button type="submit">Send Reset Link</button>
          <p class="login-text">
            Remembered? <a href="/login">Login</a>
          </p>
        </form>
      </div>
    </div>
  `,
  styles: [`
    .forgot-wrapper { display: flex; justify-content: center; margin-top: 50px; }
    .forgot-box { max-width: 400px; width: 100%; padding: 20px; border: 1px solid #ddd; border-radius: 10px; }
    .form-group { margin-bottom: 15px; }
    .error { color: red; font-size: 0.9em; }
    button { width: 100%; padding: 10px; background-color: #27ae60; color: white; border: none; border-radius: 5px; cursor: pointer; }
    button:hover { background-color: #2ecc71; }
  `]
})
export class ForgotPassword {
  forgotForm;
  loading = false;

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private router: Router
  ) {
    this.forgotForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  get email() { return this.forgotForm.get('email'); }

  onSubmit() {
    if (this.forgotForm.invalid) {
      this.forgotForm.markAllAsTouched();
      return;
    }

   this.loading = true;
this.auth.forgotPassword(this.email?.value ?? '').subscribe({
  next: (res) => {
    this.loading = false;
    alert(res?.message || 'Reset link sent!');

    // Redirect to Reset Password page with a mock token
    const mockToken = 'DEMO123TOKEN';
    this.router.navigate(['/reset-password'], { queryParams: { token: mockToken } });
  },
  error: (err) => {
    this.loading = false;
    console.error('Forgot password error:', err);
    alert(err?.error?.message || 'Error sending reset link.');
  }
});

  }
}
