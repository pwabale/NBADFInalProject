import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import swal from "sweetalert2"
@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  email:string='';
  password:string='';


  constructor(private authService :AuthService , private router: Router) { }

  ngOnInit(): void {
  }

  register() {
    this.authService.register(this.email, this.password).subscribe(
      (response) => {
        // Handle successful login, e.g., navigate to another page
        console.log('register successful:', response);
        this.authService.setSession(response.token);
        // show the waring message 20 second  before the token expire
        this.router.navigate(['/dashboard']);
        swal.fire('Success!', response.message, 'success');
      },
      (error) => {
        // Handle login error, display an error message, etc.
        console.error(error);
        swal.fire('Error!', error.error.error, 'error');
      }
    );
  }
}
