import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Order } from '../models/product.model';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private ordersSubject: BehaviorSubject<Order[]>;
  public orders: Observable<Order[]>;

  constructor() {
    const storedOrders = localStorage.getItem('orders');
    const initialOrders = storedOrders ? JSON.parse(storedOrders) : this.getMockOrders();
    this.ordersSubject = new BehaviorSubject<Order[]>(initialOrders);
    this.orders = this.ordersSubject.asObservable();
    
    // Salvar mock orders se não existirem
    if (!storedOrders) {
      localStorage.setItem('orders', JSON.stringify(initialOrders));
    }
  }

  private getMockOrders(): Order[] {
    return [
      {
        id: 1,
        userId: 2,
        items: [
          { id: 1, name: 'Bolo Red Velvet', description: 'Delicioso bolo red velvet com cream cheese', price: 120, image: 'https://images.unsplash.com/photo-1586985289688-ca3cf47d3e6e?w=400', category: 'Bolos', stock: 10, quantity: 1 }
        ],
        total: 120,
        status: 'completed',
        createdAt: new Date('2025-09-28')
      },
      {
        id: 2,
        userId: 2,
        items: [
          { id: 2, name: 'Bolo de Chocolate Belga', description: 'Bolo de chocolate com cobertura de ganache', price: 150, image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400', category: 'Bolos', stock: 8, quantity: 1 },
          { id: 4, name: 'Macarons Sortidos', description: 'Caixa com 12 macarons de sabores variados', price: 80, image: 'https://images.unsplash.com/photo-1569864358642-9d1684040f43?w=400', category: 'Doces', stock: 20, quantity: 2 }
        ],
        total: 310,
        status: 'pending',
        createdAt: new Date('2025-10-01')
      },
      {
        id: 3,
        userId: 3,
        items: [
          { id: 3, name: 'Bolo de Morango', description: 'Bolo de morango com chantilly e morangos frescos', price: 130, image: 'https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=400', category: 'Bolos', stock: 12, quantity: 1 }
        ],
        total: 130,
        status: 'processing',
        createdAt: new Date('2025-09-30')
      },
      {
        id: 4,
        userId: 2,
        items: [
          { id: 5, name: 'Cupcakes Gourmet', description: 'Kit com 6 cupcakes decorados', price: 60, image: 'https://images.unsplash.com/photo-1576618148400-f54bed99fcfd?w=400', category: 'Doces', stock: 15, quantity: 3 }
        ],
        total: 180,
        status: 'completed',
        createdAt: new Date('2025-09-25')
      },
      {
        id: 5,
        userId: 3,
        items: [
          { id: 6, name: 'Torta de Limão', description: 'Torta de limão siciliano com merengue', price: 95, image: 'https://images.unsplash.com/photo-1519915212116-7cfef71f1d3e?w=400', category: 'Tortas', stock: 10, quantity: 1 }
        ],
        total: 95,
        status: 'pending',
        createdAt: new Date('2025-10-02')
      }
    ];
  }

  getAllOrders(): Order[] {
    return this.ordersSubject.value;
  }

  getOrdersByUserId(userId: number): Order[] {
    return this.ordersSubject.value.filter(order => order.userId === userId);
  }

  getOrderById(orderId: number): Order | undefined {
    return this.ordersSubject.value.find(order => order.id === orderId);
  }

  createOrder(order: Order): void {
    const orders = this.ordersSubject.value;
    orders.push(order);
    this.updateOrders(orders);
  }

  updateOrderStatus(orderId: number, status: 'pending' | 'processing' | 'completed' | 'cancelled'): void {
    const orders = this.ordersSubject.value;
    const order = orders.find(o => o.id === orderId);
    if (order) {
      order.status = status;
      this.updateOrders(orders);
    }
  }

  getTotalOrders(): number {
    return this.ordersSubject.value.length;
  }

  getCompletedOrders(): number {
    return this.ordersSubject.value.filter(order => order.status === 'completed').length;
  }

  getPendingOrders(): number {
    return this.ordersSubject.value.filter(order => order.status === 'pending').length;
  }

  getProcessingOrders(): number {
    return this.ordersSubject.value.filter(order => order.status === 'processing').length;
  }

  getTotalRevenue(): number {
    return this.ordersSubject.value
      .filter(order => order.status === 'completed')
      .reduce((total, order) => total + order.total, 0);
  }

  private updateOrders(orders: Order[]): void {
    localStorage.setItem('orders', JSON.stringify(orders));
    this.ordersSubject.next(orders);
  }
}
