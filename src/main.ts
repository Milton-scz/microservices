// main.ts
import { enableProdMode, importProvidersFrom } from '@angular/core';
import { environment } from './environments/environment';
import { BrowserModule, bootstrapApplication } from '@angular/platform-browser';
import { AppRoutingModule } from './app/app-routing.module';
import { provideAnimations } from '@angular/platform-browser/animations';
import { AppComponent } from './app/app.component';
import { AppModule } from './app/app.module';
import { ReactiveFormsModule } from '@angular/forms';
if (environment.production) {
  enableProdMode();
}

bootstrapApplication(AppComponent, {
  providers: [
    importProvidersFrom(BrowserModule,AppModule, AppRoutingModule, ReactiveFormsModule),
    provideAnimations(),
  ],
}).catch((err) => console.error(err));
