import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { CartService } from '../../services/cart.service';
import { AuthService } from '../../services/auth.service';
import { Product } from '../../models/product.model';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {
  products: Product[] = [];
  showAddedToast = false;
  addedProductName = '';
  heroSlides = [
    {
      image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=1200',
      title: 'Bolos Artesanais de Luxo',
      subtitle: 'Criações únicas para momentos especiais',
      cta: 'Ver Coleção'
    },
    {
      image: 'https://images.unsplash.com/photo-1586985289688-ca3cf47d3e6e?w=1200',
      title: 'Sabores Refinados',
      subtitle: 'Ingredientes premium em cada receita',
      cta: 'Encomendar'
    },
    {
      image: 'https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=1200',
      title: 'Arte em Confeitaria',
      subtitle: 'Onde cada bolo é uma obra de arte',
      cta: 'Descobrir'
    }
  ];
  currentSlide = 0;

  constructor(
    private productService: ProductService,
    private cartService: CartService,
    public authService: AuthService
  ) {}

  ngOnInit(): void {
    this.products = this.productService.getAllProducts();
    this.startCarousel();
  }

  startCarousel(): void {
    setInterval(() => {
      this.nextSlide();
    }, 5000);
  }

  nextSlide(): void {
    this.currentSlide = (this.currentSlide + 1) % this.heroSlides.length;
  }

  prevSlide(): void {
    this.currentSlide = this.currentSlide === 0 ? this.heroSlides.length - 1 : this.currentSlide - 1;
  }

  goToSlide(index: number): void {
    this.currentSlide = index;
  }

  addToCart(product: Product): void {
    this.cartService.addToCart(product);
    this.addedProductName = product.name;
    this.showAddedToast = true;
    
    setTimeout(() => {
      this.showAddedToast = false;
    }, 3000);
  }

  scrollToCollection(): void {
    const element = document.getElementById('nossa-colecao');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }
}
