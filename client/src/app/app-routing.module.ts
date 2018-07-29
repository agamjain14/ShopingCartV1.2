import { RouterModule, Routes, Router } from '@angular/router';
import { NgModule } from '@angular/core';
import { HomeComponent } from './component/home/home.component';
import { DashboardComponent } from './component/dashboard/dashboard.component';
import { RegisterComponent } from './component/register/register.component';
import { LoginComponent } from './component/login/login.component';
import { ProfileComponent } from './component/profile/profile.component';
import { AuthGuard } from './guards/auth.guard';
import { NotAuthGuard } from './guards/notAuth.guard';
import { ProductsComponent } from './component/products/products.component';
import { ShoppingCartComponent } from './component/shopping-cart/shopping-cart.component';
import { CheckOutComponent } from './component/check-out/check-out.component';
import { OrderSuccessComponent } from './component/order-success/order-success.component';
import { AdminProductsComponent } from './component/admin/admin-products/admin-products.component';
import { AdminOrdersComponent } from './component/admin/admin-orders/admin-orders.component';
import { MyOrdersComponent } from './component/my-orders/my-orders.component';
import { AdminAuthGuard } from './guards/admin.auth.guard';

const appRoutes: Routes = [
    // ANONYMOUS USER
    {path: '', component: HomeComponent},
    {path: 'products', component: ProductsComponent},
    {path: 'shopping-cart', component: ShoppingCartComponent},
    {path: 'login', component: LoginComponent, canActivate: [NotAuthGuard]},
    {path: 'register', component: RegisterComponent, canActivate: [NotAuthGuard]},

    // NORMAL USERS
    {path: 'check-out', component: CheckOutComponent, canActivate: [AuthGuard]},
    {path: 'order-success', component: OrderSuccessComponent},
    {path: 'my/orders', component: MyOrdersComponent},

    // ADMIN USERs
    {path: 'admin/products', component: AdminProductsComponent, canActivate: [AuthGuard, AdminAuthGuard]},
    {path: 'admin/orders', component: AdminOrdersComponent, canActivate: [AuthGuard, AdminAuthGuard]},

    // FOR NORMAL AND ADMIN USER
    {path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard]},
    {path: 'profile', component: ProfileComponent, canActivate: [AuthGuard]},
    {path: '**', component: HomeComponent}
];

@NgModule({
    declarations: [],
    imports: [RouterModule.forRoot(appRoutes)],
    providers: [],
    bootstrap: [],
    exports: [RouterModule]
})
export class AppRoutingModule { }
