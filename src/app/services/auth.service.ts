import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { User } from '../models/product.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject: BehaviorSubject<User | null>;
  public currentUser: Observable<User | null>;

  constructor() {
    const storedUser = localStorage.getItem('currentUser');
    this.currentUserSubject = new BehaviorSubject<User | null>(
      storedUser ? JSON.parse(storedUser) : null
    );
    this.currentUser = this.currentUserSubject.asObservable();
    
    // Inicializar usuários padrão se não existirem
    this.initializeDefaultUsers();
  }

  private initializeDefaultUsers(): void {
    const users = localStorage.getItem('users');
    if (!users) {
      const defaultUsers: User[] = [
        {
          id: 1,
          name: 'Administrador',
          email: 'admin@moniscakes.com',
          password: 'admin123',
          role: 'admin'
        },
        {
          id: 2,
          name: 'Cliente Teste',
          email: 'cliente@teste.com',
          password: 'cliente123',
          role: 'client'
        }
      ];
      localStorage.setItem('users', JSON.stringify(defaultUsers));
    }
  }

  public get currentUserValue(): User | null {
    return this.currentUserSubject.value;
  }

  login(email: string, password: string): boolean {
    const users: User[] = JSON.parse(localStorage.getItem('users') || '[]');
    const user = users.find(u => u.email === email && u.password === password);

    if (user) {
      localStorage.setItem('currentUser', JSON.stringify(user));
      this.currentUserSubject.next(user);
      return true;
    }

    return false;
  }

  register(user: User): boolean {
    const users: User[] = JSON.parse(localStorage.getItem('users') || '[]');
    
    // Verificar se o email já existe
    if (users.some(u => u.email === user.email)) {
      return false;
    }

    users.push(user);
    localStorage.setItem('users', JSON.stringify(users));
    
    return true;
  }

  logout(): void {
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
  }

  isLoggedIn(): boolean {
    return this.currentUserValue !== null;
  }

  isAdmin(): boolean {
    return this.currentUserValue?.role === 'admin';
  }

  getAllUsers(): User[] {
    return JSON.parse(localStorage.getItem('users') || '[]');
  }

  updateUserRole(userId: number, newRole: 'admin' | 'client'): void {
    const users: User[] = JSON.parse(localStorage.getItem('users') || '[]');
    const userIndex = users.findIndex(u => u.id === userId);
    
    if (userIndex !== -1) {
      users[userIndex].role = newRole;
      localStorage.setItem('users', JSON.stringify(users));
    }
  }

  deleteUser(userId: number): void {
    const users: User[] = JSON.parse(localStorage.getItem('users') || '[]');
    const filteredUsers = users.filter(u => u.id !== userId);
    localStorage.setItem('users', JSON.stringify(filteredUsers));
  }

  setLastRoute(route: string): void {
    if (this.isLoggedIn()) {
      localStorage.setItem('lastRoute', route);
    }
  }

  getLastRoute(): string | null {
    return localStorage.getItem('lastRoute');
  }

  clearLastRoute(): void {
    localStorage.removeItem('lastRoute');
  }
}
