import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="forgot-wrapper">
      <div class="forgot-box">
        <h2>Reset Password</h2>
        <form [formGroup]="resetForm" (ngSubmit)="onSubmit()">
          <div class="form-group">
            <label>New Password</label>
            <input type="password" formControlName="newPassword" placeholder="Enter new password" />
            <div class="error" *ngIf="newPassword?.invalid && newPassword?.touched">
              Password must be at least 6 characters
            </div>
          </div>

          <button type="submit">Reset Password</button>

          <p class="login-text">
            Back to <a href="/login">Login</a>
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
export class ResetPassword {
  resetForm;
  loading = false;
  token: string = ''; // initialize to fix TS2564

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.resetForm = this.fb.group({
      newPassword: ['', [Validators.required, Validators.minLength(6)]]
    });

    // Get token from query params: /reset-password?token=xxx
    this.route.queryParams.subscribe(params => {
      this.token = params['token'] || '';
    });
  }

  get newPassword() { return this.resetForm.get('newPassword'); }

  onSubmit() {
    if (this.resetForm.invalid) {
      this.resetForm.markAllAsTouched();
      return;
    }

    this.loading = true;
    this.auth.resetPassword(this.token, this.newPassword?.value ?? '').subscribe({
      next: (res) => {
        this.loading = false;
        alert(res?.message || 'Password reset successful!');
        this.router.navigate(['/login']);
      },
      error: (err) => {
        this.loading = false;
        console.error('Reset password error:', err);
        alert(err?.error?.message || 'Error resetting password.');
      }
    });
  }
}
