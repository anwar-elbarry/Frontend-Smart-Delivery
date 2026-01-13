import {Component, inject, signal} from '@angular/core';
import {Router, RouterModule} from '@angular/router';
import {Field, form, minLength, required, submit,} from '@angular/forms/signals';
import { AuthService } from '../../../../core/services/auth.service';
import { LoginCredentials } from '../../../../core/models/auth/auth.model';

@Component({
  selector: 'app-login.component',
  standalone: true,
  imports: [RouterModule, Field],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {

  private authService = inject(AuthService);
  private router = inject(Router)

   loginModel = signal<LoginCredentials>({
    username: '',
    password: ''
  });

   loginForm = form(this.loginModel,(schemaPath) => {
    required(schemaPath.username,{message:'username is required'});
    required(schemaPath.password,{message:'password is required'});
    minLength(schemaPath.password,8,{message:'password must be at least 8 digits'});
  })

  onSubmit(event: Event){
    event.preventDefault();
    
        submit(this.loginForm, async ()=> {
          const credentials = this.loginModel();

          this.authService.login(credentials).subscribe({
            next: () => {
              console.log('loggin successful');
              this.router.navigate(['/dashboard'])
            },
            error: (err) => {
              console.log('error:',err);
            }
          })
        });
  }
}
