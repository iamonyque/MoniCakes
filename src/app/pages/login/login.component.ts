import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  isLoginMode = true;
  showForgotPassword = false;
  
  // Login form
  loginEmail = '';
  loginPassword = '';
  
  // Register form
  registerName = '';
  registerEmail = '';
  registerPassword = '';
  registerConfirmPassword = '';
  acceptTerms = false;
  
  // Forgot password form
  forgotPasswordEmail = '';
  
  errorMessage = '';
  successMessage = '';

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  toggleMode(): void {
    this.isLoginMode = !this.isLoginMode;
    this.errorMessage = '';
  }

  onLogin(): void {
    this.errorMessage = '';
    
    if (!this.loginEmail || !this.loginPassword) {
      this.errorMessage = 'Por favor, preencha todos os campos.';
      return;
    }

    if (this.authService.login(this.loginEmail, this.loginPassword)) {
      this.router.navigate(['/dashboard']);
    } else {
      this.errorMessage = 'Email ou senha incorretos.';
    }
  }

  onRegister(): void {
    this.errorMessage = '';
    
    if (!this.registerName || !this.registerEmail || !this.registerPassword || !this.registerConfirmPassword) {
      this.errorMessage = 'Por favor, preencha todos os campos.';
      return;
    }

    if (this.registerPassword !== this.registerConfirmPassword) {
      this.errorMessage = 'As senhas não coincidem.';
      return;
    }

    if (this.registerPassword.length < 6) {
      this.errorMessage = 'A senha deve ter no mínimo 6 caracteres.';
      return;
    }

    if (!this.acceptTerms) {
      this.errorMessage = 'Você deve aceitar os termos de uso e política de privacidade.';
      return;
    }

    const newUser = {
      id: Date.now(),
      name: this.registerName,
      email: this.registerEmail,
      password: this.registerPassword,
      role: 'client' as const
    };

    if (this.authService.register(newUser)) {
      alert('Cadastro realizado com sucesso! Faça login para continuar.');
      this.isLoginMode = true;
      this.clearRegisterForm();
    } else {
      this.errorMessage = 'Este email já está cadastrado.';
    }
  }

  clearRegisterForm(): void {
    this.registerName = '';
    this.registerEmail = '';
    this.registerPassword = '';
    this.registerConfirmPassword = '';
    this.acceptTerms = false;
    this.errorMessage = '';
  }

  toggleForgotPassword(): void {
    this.showForgotPassword = !this.showForgotPassword;
    this.errorMessage = '';
    this.successMessage = '';
    this.forgotPasswordEmail = '';
  }

  sendPasswordReset(): void {
    this.errorMessage = '';
    this.successMessage = '';

    if (!this.forgotPasswordEmail) {
      this.errorMessage = 'Por favor, digite seu email.';
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(this.forgotPasswordEmail)) {
      this.errorMessage = 'Por favor, digite um email válido.';
      return;
    }

    // Simular envio de email de recuperação
    setTimeout(() => {
      this.successMessage = 'Um link de recuperação foi enviado para seu email!';
      setTimeout(() => {
        this.showForgotPassword = false;
        this.successMessage = '';
        this.forgotPasswordEmail = '';
      }, 3000);
    }, 1000);
  }
}