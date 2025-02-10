import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';  // 👈 Importa HttpClientModule aquí
import { AuthenticationRoutingModule } from './authentication-routing.module';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    AuthenticationRoutingModule,
    HttpClientModule  // 👈 Agregar HttpClientModule
  ]
})
export class AuthenticationModule {}

