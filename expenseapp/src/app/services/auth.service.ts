import { Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { Constants } from 'APP_CONSTANTS';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import swal from 'sweetalert2';
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  userSessionSubject$: BehaviorSubject<boolean> = new BehaviorSubject<any>(
    false
  );
  isUserLoggedIn: boolean = false;
  intervalId: any;

  constructor(private http: HttpClient, private router: Router) {
    if (this.getToken()) {
      this.isUserLoggedIn = true;
      this.userSessionSubject$.next(this.isUserLoggedIn);
      this.startUserSession();
    }
  }

  login(email: string, password: string): Observable<any> {
    return this.http.post(`${Constants.API_URL}/user/signIn`, {
      email: email,
      password: password,
    });
  }

  register(email: string, password: string): Observable<any> {
    return this.http.post(`${Constants.API_URL}/user/signUp`, {
      email: email,
      password: password,
    });
  }
  setSession(token: string) {
    localStorage.setItem('token', token);
    this.isUserLoggedIn = true;
    this.userSessionSubject$.next(this.isUserLoggedIn);
    this.startUserSession();
  }
  logout() {
    localStorage.removeItem('token');
    this.isUserLoggedIn = false;
    this.userSessionSubject$.next(this.isUserLoggedIn);
    clearInterval(this.intervalId);
    this.router.navigate(['/login']);
  }
  getUserSession(): Observable<boolean> {
    return this.userSessionSubject$.asObservable();
  }
  checkUserLoggedIn() {
    return this.isUserLoggedIn;
  }
  getToken() {
    return localStorage.getItem('token');
  }
  getNewToken(): Observable<any> {
    return this.http.get(`${Constants.API_URL}/user/refresh`);
  }
  startUserSession() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
    this.intervalId = setInterval(() => {
      swal
        .fire({
          title: 'Warning!',
          text: 'Your session will expire in 20 seconds.',
          confirmButtonText: 'Refresh',
          cancelButtonText: 'Close',
          showCancelButton: true,
          timer: 20000,
        })
        .then((result: any) => {
          if (result.isConfirmed) {
            this.getNewToken().subscribe(
              (response: any) => {
                this.setSession(response.token);
                swal.fire('Success!', response.message, 'success');
              },
              (error: any) => {
                swal.fire('Error!', error.error.message, 'error');
              }
            );
          } else if (result.isDismissed) {
            clearInterval(this.intervalId);
            this.logout();
          }
        });
    }, 1000 * 40);
  }
}
