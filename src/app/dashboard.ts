import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  template: `
    <div class="dashboard-wrapper">
      <header>
        <img 
          src="https://media.licdn.com/dms/image/v2/D4D0BAQFzcwLvPnKp1g/company-logo_200_200/company-logo_200_200/0/1722953326806/pennysoftware_logo?e=2147483647&v=beta&t=kOx9SL0tkzH4Ac5WOKMOGYygmAo9b4EZ1c1ioleN2C4" 
          alt="Penny Software Logo" 
          class="logo" 
        />
        <h1>Welcome to PENNY</h1>
        <p>Hello, {{ user?.name }}!</p>
        <p *ngIf="remainingTime">Session expires in: {{ remainingTime }}</p>
      </header>

      <section class="user-info">
        <h3>Your Information:</h3>
        <ul>
          <li><strong>Name:</strong> {{ user?.name }}</li>
          <li><strong>Email:</strong> {{ user?.email }}</li>
        </ul>
      </section>

      <button (click)="logout()">Logout</button>
    </div>
  `,
  styles: [`
    .dashboard-wrapper {
      max-width: 600px;
      margin: 50px auto;
      padding: 20px;
      text-align: center;
      font-family: Arial, sans-serif;
      border: 1px solid #ddd;
      border-radius: 10px;
      box-shadow: 0 5px 15px rgba(0,0,0,0.1);
    }

    header {
      margin-bottom: 20px;
    }

    .logo {
      width: 100px;
      height: auto;
      margin-bottom: 20px;
    }

    header h1 {
      color: #2c3e50;
      font-size: 2em;
      margin-bottom: 10px;
    }

    header p {
      color: #34495e;
      margin-bottom: 20px;
    }

    .user-info {
      text-align: left;
      margin: 20px 0;
    }

    .user-info h3 {
      color: #2c3e50;
      margin-bottom: 10px;
    }

    ul {
      list-style: none;
      padding: 0;
    }

    li {
      padding: 5px 0;
      font-size: 1em;
    }

    button {
      margin-top: 20px;
      padding: 10px 20px;
      background-color: #27ae60;
      color: white;
      border: none;
      border-radius: 5px;
      cursor: pointer;
    }

    button:hover {
      background-color: #2ecc71;
    }
  `]
})
export class Dashboard implements OnInit, OnDestroy {
  user: any;
  remainingTime: string | null = null;
  private interval: any;

  constructor(private router: Router) {}

  ngOnInit() {
    const token = localStorage.getItem('authToken');
    const storedUser = localStorage.getItem('user');
    const loginTime = localStorage.getItem('loginTime');

    const expiryHours = 8;
    const now = Date.now();

    if (!token || !storedUser || !loginTime || (now - +loginTime) > expiryHours * 60 * 60 * 1000) {
      this.logout(); // auto logout
      return;
    }

    this.user = JSON.parse(storedUser);
    this.startCountdown(+loginTime, expiryHours);
  }

  startCountdown(loginTime: number, expiryHours: number) {
    const expiryTime = loginTime + expiryHours * 60 * 60 * 1000;

    this.interval = setInterval(() => {
      const now = Date.now();
      const diff = expiryTime - now;

      if (diff <= 0) {
        this.logout();
      } else {
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);
        this.remainingTime = `${hours.toString().padStart(2,'0')}h:${minutes.toString().padStart(2,'0')}m:${seconds.toString().padStart(2,'0')}s`;
      }
    }, 1000);
  }

  logout() {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    localStorage.removeItem('loginTime');
    clearInterval(this.interval);
    this.router.navigate(['/login']);
  }

  ngOnDestroy() {
    clearInterval(this.interval);
  }
}
