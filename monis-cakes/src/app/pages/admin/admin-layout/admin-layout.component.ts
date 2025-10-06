import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { OrderService } from '../../../services/order.service';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './admin-layout.component.html',
  styleUrl: './admin-layout.component.scss'
})
export class AdminLayoutComponent implements OnInit {
  showOrdersPanel = false;
  totalOrders = 0;
  completedOrders = 0;
  pendingOrders = 0;
  processingOrders = 0;
  totalRevenue = 0;

  constructor(
    private orderService: OrderService,
    public authService: AuthService
  ) {}

  ngOnInit(): void {
    this.updateOrderStats();
  }

  toggleOrdersPanel(): void {
    this.showOrdersPanel = !this.showOrdersPanel;
    if (this.showOrdersPanel) {
      this.updateOrderStats();
    }
  }

  updateOrderStats(): void {
    this.totalOrders = this.orderService.getTotalOrders();
    this.completedOrders = this.orderService.getCompletedOrders();
    this.pendingOrders = this.orderService.getPendingOrders();
    this.processingOrders = this.orderService.getProcessingOrders();
    this.totalRevenue = this.orderService.getTotalRevenue();
  }

  logout(): void {
    this.authService.logout();
  }
}
