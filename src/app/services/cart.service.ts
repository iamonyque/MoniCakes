import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { CartItem, Product } from '../models/product.model';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cartSubject: BehaviorSubject<CartItem[]>;
  public cart: Observable<CartItem[]>;

  constructor() {
    const storedCart = localStorage.getItem('cart');
    const initialCart = storedCart ? JSON.parse(storedCart) : [];
    this.cartSubject = new BehaviorSubject<CartItem[]>(initialCart);
    this.cart = this.cartSubject.asObservable();
  }

  getCart(): CartItem[] {
    return this.cartSubject.value;
  }

  getCartCount(): number {
    return this.cartSubject.value.reduce((total, item) => total + item.quantity, 0);
  }

  getCartTotal(): number {
    return this.cartSubject.value.reduce(
      (total, item) => total + (item.price * item.quantity), 
      0
    );
  }

  addToCart(product: Product): void {
    const cart = this.cartSubject.value;
    const existingItem = cart.find(item => item.id === product.id);

    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      const newItem: CartItem = { ...product, quantity: 1 };
      cart.push(newItem);
    }

    this.updateCart(cart);
  }

  removeFromCart(productId: number): void {
    const cart = this.cartSubject.value.filter(item => item.id !== productId);
    this.updateCart(cart);
  }

  updateQuantity(productId: number, quantity: number): void {
    const cart = this.cartSubject.value;
    const item = cart.find(i => i.id === productId);

    if (item) {
      if (quantity <= 0) {
        this.removeFromCart(productId);
      } else {
        item.quantity = quantity;
        this.updateCart(cart);
      }
    }
  }

  clearCart(): void {
    this.updateCart([]);
  }

  private updateCart(cart: CartItem[]): void {
    localStorage.setItem('cart', JSON.stringify(cart));
    this.cartSubject.next(cart);
  }
}
