import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { AppRoutingComponents, AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { FormsModule } from '@angular/forms';
import { FlashMessagesModule } from 'angular2-flash-messages'
import { AuthService } from './services/auth.service';
import { JwtHelperService, JwtModule, } from '@auth0/angular-jwt';
import { AuthGuard } from './guards/auth.guard';
import { AddRestaurantComponent } from './components/add-restaurant/add-restaurant.component';
import { TokenInterceptorService } from './services/token-interceptor.service';
import { ErrorInterceptorService } from './services/error-interceptor.service';
import { WildcardComponent } from './components/wildcard/wildcard.component';
import { RestaurantDetailsComponent } from './components/restaurant-details/restaurant-details.component';
import { RestaurantDetailOverviewComponent } from './components/restaurant-details/restaurant-detail-overview/restaurant-detail-overview.component';
import { RestaurantDetailOrderComponent } from './components/restaurant-details/restaurant-detail-order/restaurant-detail-order.component';
import { FogotPassComponent } from './components/fogot-pass/fogot-pass.component';
import { ResetPassComponent } from './components/reset-pass/reset-pass.component';
import { StoreModule } from '@ngrx/store';
import { reducer } from './reducers/cart.reducer';
import { ReadComponent } from './read/read.component';
import { MapComponent } from './components/map/map.component';
import { AngularOpenlayersModule } from 'ngx-openlayers';
import { GeoLocationService } from './services/geo-location.service';
import { LoaderComponent } from './components/loader/loader.component';
import { LoaderInterceptorService } from './services/loader-interceptor.service';
import { LoaderService } from './services/loader.service';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    AddRestaurantComponent,
    AppRoutingComponents,
    WildcardComponent,
    RestaurantDetailsComponent,
    RestaurantDetailOverviewComponent, 
    RestaurantDetailOrderComponent, 
    FogotPassComponent, 
    ResetPassComponent, 
    ReadComponent, 
    MapComponent, 
    LoaderComponent
  ],
  imports: [
    NgbModule,
    BrowserModule,
    AppRoutingModule,
    RouterModule,
    FormsModule,
    JwtModule.forRoot({
      config: {
        tokenGetter: () => {
          return localStorage.getItem('id_token');
        },
        allowedDomains: ['localhost:4200', 'https://thawing-caverns-75517.herokuapp.com/*'],
        disallowedRoutes: ['localhost:4200/login', 'https://thawing-caverns-75517.herokuapp.com/api/v1/auth/login']
      }
    }),
    StoreModule.forRoot({
      cart: reducer
    }),
    HttpClientModule,
    FlashMessagesModule.forRoot(),
    AngularOpenlayersModule
  ],
  providers: [    
    LoaderService, 
    { 
      provide: HTTP_INTERCEPTORS, 
      useClass: LoaderInterceptorService, 
      multi: true 
    },
    AuthService, 
    JwtHelperService, 
    AuthGuard, 
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptorService,
      multi: true
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ErrorInterceptorService,
      multi: true
    },
    GeoLocationService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
