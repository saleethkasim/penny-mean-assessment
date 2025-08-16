import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../services/auth.service'; // adjust path if needed
import { Router } from '@angular/router';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './signup.html',
  styleUrls: ['./signup.css']
})
export class Signup {
  signupForm;
  loading = false;

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private router: Router
  ) {
    this.signupForm = this.fb.group({
      name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  get name() { return this.signupForm.get('name'); }
  get email() { return this.signupForm.get('email'); }
  get password() { return this.signupForm.get('password'); }

  onSubmit() {
    if (this.signupForm.invalid) {
      this.signupForm.markAllAsTouched();
      alert('⚠️ Please fill all required fields correctly.');
      return;
    }

    this.loading = true;
    const formData = {
      name: this.name?.value ?? '',
      email: this.email?.value ?? '',
      password: this.password?.value ?? ''
    };

    console.log('Submitting form data:', formData);

    this.auth.signup(formData).subscribe({
      next: (res) => {
        this.loading = false;
        console.log('Signup successful:', res);
        alert('✅ Signup successful! You can now log in.');
        this.router.navigate(['/login']);
      },
      error: (err) => {
        this.loading = false;
        console.error('Signup failed:', err);
        alert(`❌ Signup failed: ${err?.error?.message || 'Please try again.'}`);
      }
    });
  }
}
