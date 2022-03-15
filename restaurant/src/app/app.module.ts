import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {BasketComponent} from './basket/basket.component';
import {DishesListComponent} from './dishes-list/dishes-list.component';
import {RouterModule} from "@angular/router";
import {AddButtonComponent} from './add-button/add-button.component';
import {RemoveButtonComponent} from './remove-button/remove-button.component';
import {DishesService} from "./services/dishes.service";
import {RatingsComponent} from './ratings/ratings.component';
import {DishComponent} from './dish/dish.component';
import {NavbarComponent} from './navbar/navbar.component';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {DishesComponent} from './dishes/dishes.component';
import {FooterComponent} from './footer/footer.component';
import {AddDishComponent} from './add-dish/add-dish.component';
import {StarComponent} from './star/star.component';
import {RatingNotationPipe} from './rating-notation.pipe';
import {PaginationSelectorComponent} from './pagination-selector/pagination-selector.component';
import {DishDetailsComponent} from './dish-details/dish-details.component';
import {HomePageComponent} from './home-page/home-page.component';
import {GalleryComponent} from './gallery/gallery.component';
import {DishSelectorComponent} from './dish-selector/dish-selector.component';
import {CommentsFormComponent} from './comments-form/comments-form.component';
import {GoogleMapsModule} from "@angular/google-maps";
import {CurrencyConverterPipe} from './currency-converter.pipe';
import {HTTP_INTERCEPTORS, HttpClient, HttpClientModule} from "@angular/common/http";
import {CommentService} from "./services/comment.service";
import {ApiConnectionService} from "./services/api-connection.service";
import {LoginComponent} from './login/login.component';
import {RegisterComponent} from './register/register.component';
import {CookieModule, CookieService} from "ngx-cookie";
import {AuthInterceptor} from "./auth.interceptor";
import {AdminPanelComponent} from './admin-panel/admin-panel.component';
import {DishManagerComponent} from './dish-manager/dish-manager.component';
import {UserComponent} from './user/user.component';
import {AuthGuard} from "./guard/auth.guard";
import {Role} from "./role";
import { DishEditorComponent } from './dish-editor/dish-editor.component';
import { GoBackButtonComponent } from './go-back-button/go-back-button.component';

@NgModule({
  declarations: [
    AppComponent,
    BasketComponent,
    DishesListComponent,
    AddButtonComponent,
    RemoveButtonComponent,
    RatingsComponent,
    DishComponent,
    NavbarComponent,
    DishesComponent,
    FooterComponent,
    AddDishComponent,
    StarComponent,
    RatingNotationPipe,
    PaginationSelectorComponent,
    DishDetailsComponent,
    HomePageComponent,
    GalleryComponent,
    DishSelectorComponent,
    CommentsFormComponent,
    CurrencyConverterPipe,
    LoginComponent,
    RegisterComponent,
    AdminPanelComponent,
    DishManagerComponent,
    UserComponent,
    DishEditorComponent,
    GoBackButtonComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    RouterModule.forRoot([
      {path: 'home', component: HomePageComponent},
      {path: 'login', component: LoginComponent, canActivate:[AuthGuard], data: {roles:[], allowBanned:true, allowLoggedIn:false, requireLogin:false}},
      {path: 'register', component: RegisterComponent, canActivate:[AuthGuard], data: {roles:[], allowBanned:true, allowLoggedIn:false, requireLogin:false}},
      {path: 'admin', component: AdminPanelComponent, canActivate:[AuthGuard], data: {roles:[Role.ADMIN], allowBanned:true, allowLoggedIn:true, requireLogin:true}},
      {path: 'manager', component: DishManagerComponent, canActivate:[AuthGuard], data: {roles:[Role.MANAGER], allowBanned:true, allowLoggedIn:true, requireLogin:true}},
      {path: 'edit/:id', component: DishEditorComponent, canActivate:[AuthGuard], data: {roles:[Role.MANAGER], allowBanned:true, allowLoggedIn:true, requireLogin:true}},
      {path: 'cart', component: BasketComponent, canActivate:[AuthGuard], data: {roles:[Role.CLIENT], allowBanned:true, allowLoggedIn:true, requireLogin:true}},
      {path: 'user', component: UserComponent, canActivate:[AuthGuard], data: {roles:[Role.CLIENT, Role.MANAGER, Role.ADMIN], allowBanned:true, allowLoggedIn:true, requireLogin:true}},
      {path: 'products', component: DishesListComponent},
      {path: 'products/:id', component: DishDetailsComponent, canActivate:[AuthGuard], data: {roles:[Role.CLIENT, Role.MANAGER, Role.ADMIN], allowBanned:true, allowLoggedIn:true, requireLogin:true}},
      {path: '**', redirectTo:'home'}
    ]),
    FormsModule,
    ReactiveFormsModule,
    GoogleMapsModule,
    HttpClientModule,
    CookieModule.forRoot()
  ],
  providers: [
    DishesService,
    HttpClient,
    CommentService,
    ApiConnectionService,
    CookieService,
    {provide:HTTP_INTERCEPTORS, useClass:AuthInterceptor, multi:true}
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
