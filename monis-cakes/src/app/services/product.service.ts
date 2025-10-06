import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Product } from '../models/product.model';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private productsSubject: BehaviorSubject<Product[]>;
  public products: Observable<Product[]>;

  constructor() {
    this.initializeDefaultProducts();
    const storedProducts = localStorage.getItem('products');
    const initialProducts = storedProducts ? JSON.parse(storedProducts) : [];
    this.productsSubject = new BehaviorSubject<Product[]>(initialProducts);
    this.products = this.productsSubject.asObservable();
  }

  private initializeDefaultProducts(): void {
    const products = localStorage.getItem('products');
    if (!products) {
      const defaultProducts: Product[] = [
        {
          id: 1,
          name: 'Bolo Red Velvet',
          description: 'Delicioso bolo red velvet com cream cheese',
          price: 120.00,
          image: 'https://images.unsplash.com/photo-1586985289688-ca3cf47d3e6e?w=500',
          category: 'Bolos',
          available: true
        },
        {
          id: 2,
          name: 'Bolo de Chocolate Belga',
          description: 'Bolo de chocolate com cobertura de ganache',
          price: 150.00,
          image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=500',
          category: 'Bolos',
          available: true
        },
        {
          id: 3,
          name: 'Bolo de Morango',
          description: 'Bolo de morango com chantilly e morangos frescos',
          price: 130.00,
          image: 'https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=500',
          category: 'Bolos',
          available: true
        },
        {
          id: 4,
          name: 'Macarons Sortidos',
          description: 'Caixa com 12 macarons de sabores variados',
          price: 80.00,
          image: 'https://images.unsplash.com/photo-1569864358642-9d1684040f43?w=500',
          category: 'Doces',
          available: true
        },
        {
          id: 5,
          name: 'Cupcakes Gourmet',
          description: 'Kit com 6 cupcakes decorados',
          price: 60.00,
          image: 'https://images.unsplash.com/photo-1614707267537-b85aaf00c4b7?w=500',
          category: 'Doces',
          available: true
        },
        {
          id: 6,
          name: 'Torta de Limão',
          description: 'Torta de limão siciliano com merengue',
          price: 95.00,
          image: 'https://images.unsplash.com/photo-1519915028121-7d3463d20b13?w=500',
          category: 'Tortas',
          available: true
        }
      ];
      localStorage.setItem('products', JSON.stringify(defaultProducts));
    }
  }

  getAllProducts(): Product[] {
    return this.productsSubject.value;
  }

  getProductById(id: number): Product | undefined {
    return this.productsSubject.value.find(p => p.id === id);
  }

  addProduct(product: Omit<Product, 'id'>): void {
    const products = this.productsSubject.value;
    const newProduct: Product = {
      ...product,
      id: products.length > 0 ? Math.max(...products.map(p => p.id)) + 1 : 1
    };
    const updatedProducts = [...products, newProduct];
    localStorage.setItem('products', JSON.stringify(updatedProducts));
    this.productsSubject.next(updatedProducts);
  }

  updateProduct(id: number, product: Partial<Product>): void {
    const products = this.productsSubject.value;
    const index = products.findIndex(p => p.id === id);
    
    if (index !== -1) {
      products[index] = { ...products[index], ...product };
      localStorage.setItem('products', JSON.stringify(products));
      this.productsSubject.next(products);
    }
  }

  deleteProduct(id: number): void {
    const products = this.productsSubject.value.filter(p => p.id !== id);
    localStorage.setItem('products', JSON.stringify(products));
    this.productsSubject.next(products);
  }
}
