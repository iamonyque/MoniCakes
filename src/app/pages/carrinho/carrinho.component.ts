import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { CartService } from '../../services/cart.service';
import { AuthService } from '../../services/auth.service';
import { OrderService } from '../../services/order.service';
import { CartItem, Order } from '../../models/product.model';

@Component({
  selector: 'app-carrinho',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './carrinho.component.html',
  styleUrl: './carrinho.component.scss'
})
export class CarrinhoComponent implements OnInit {
  cartItems: CartItem[] = [];
  cartTotal = 0;
  cartCount = 0;

  constructor(
    private cartService: CartService,
    private authService: AuthService,
    private orderService: OrderService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadCart();
    this.cartService.cart.subscribe(() => {
      this.loadCart();
    });
  }

  loadCart(): void {
    this.cartItems = this.cartService.getCart();
    this.cartTotal = this.cartService.getCartTotal();
    this.cartCount = this.cartService.getCartCount();
  }

  increaseQuantity(productId: number): void {
    const item = this.cartItems.find(i => i.id === productId);
    if (item) {
      this.cartService.updateQuantity(productId, item.quantity + 1);
    }
  }

  decreaseQuantity(productId: number): void {
    const item = this.cartItems.find(i => i.id === productId);
    if (item && item.quantity > 1) {
      this.cartService.updateQuantity(productId, item.quantity - 1);
    }
  }

  removeItem(productId: number): void {
    if (confirm('Deseja remover este item do carrinho?')) {
      this.cartService.removeFromCart(productId);
    }
  }

  clearCart(): void {
    if (confirm('Deseja limpar todo o carrinho?')) {
      this.cartService.clearCart();
    }
  }

  finalizePurchase(): void {
    const currentUser = this.authService.currentUserValue;
    
    if (!currentUser) {
      // Redirecionar para login se não estiver logado
      this.router.navigate(['/login']);
      return;
    }

    if (this.cartItems.length === 0) {
      alert('Seu carrinho está vazio!');
      return;
    }

    // Criar novo pedido
    const newOrder: Order = {
      id: Date.now(),
      userId: currentUser.id,
      items: [...this.cartItems],
      total: this.cartTotal,
      status: 'pending',
      createdAt: new Date()
    };

    this.orderService.createOrder(newOrder);
    this.cartService.clearCart();
    
    alert('Pedido realizado com sucesso! Acompanhe o status em "Meus Pedidos".');
    this.router.navigate(['/dashboard']);
  }
}
