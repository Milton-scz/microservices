import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, from } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PagoFacilService {


  constructor(private http: HttpClient) {}
  // 🚀 Convertimos Promise a Observable usando `from()`
  generarCobroSimulado(requestData: any): Observable<any> {
    return from(this.generarCobroSimuladoPromise(requestData));
  }

  // Simulación de generación de cobro como en tu lógica PHP (sin interacción con la base de datos)
  async generarCobroSimuladoPromise(requestData: any): Promise<any> {
    try {
      // Generar un número de pago aleatorio
      let nroPago = this.generarNroPago();

      // Lógica de procesamiento similar a la del PHP
      const lcComerceID = 'd029fa3a95e174a19934857f535eb9427d967218a36ea014b70ad704bc6c8d1c'; // Comercio ID (reemplázalo por el real)
      const lnMoneda = 1; // Moneda (1 = Bolivia, según el código PHP)
      const lnTelefono = requestData.tnTelefono;
      const lcNombreUsuario = requestData.tcRazonSocial;
      const lnCiNit = requestData.tcCiNit;
      const lcNroPago = nroPago; // Número de pago generado
      const lnMontoClienteEmpresa = requestData.tnMonto;
      const lcCorreo = requestData.tcCorreo;
      const lcUrlCallBack = ''; // URL para el callback (ajústalo a la real)
      const lcUrlReturn = ''; // Puedes dejarlo vacío o agregar la URL de retorno

      // Lógica de tipo de servicio (QR o Tigo Money)
      let lcUrl = '';
      if (requestData.tnTipoServicio === 1) {
        lcUrl = 'https://serviciostigomoney.pagofacil.com.bo/api/servicio/generarqrv2'; // Para QR
      } else if (requestData.tnTipoServicio === 2) {
        lcUrl = 'https://serviciostigomoney.pagofacil.com.bo/api/servicio/realizarpagotigomoneyv2'; // Para Tigo Money
      }

      const laHeader = {
        'Accept': 'application/json'
      };

      const laBody = {
        tcCommerceID: lcComerceID,
        tnMoneda: lnMoneda,
        tnTelefono: lnTelefono,
        tcNombreUsuario: lcNombreUsuario,
        tnCiNit: lnCiNit,
        tcNroPago: lcNroPago,
        tnMontoClienteEmpresa: lnMontoClienteEmpresa,
        tcCorreo: lcCorreo,
        tcUrlCallBack: lcUrlCallBack,
        tcUrlReturn: lcUrlReturn,
      };

      // Realizar la solicitud HTTP (simulación con Fetch o Axios, puedes usar lo que prefieras)
      const response = await this.httpPost(lcUrl, laHeader, laBody);

      // Si el servicio fue exitoso, procesar el resultado
      if (response) {
        const laResult = response; // Aquí iría la respuesta real desde el servidor
        const laValues = laResult.values.split(';')[1]; // Extracción del valor del QR
        const nroTransaccion = laResult.values.split(';')[0]; // ID de transacción

        // Regresar el código QR y número de transacción
        const laQrImage = 'data:image/png;base64,' + laValues; // Imágen QR en Base64

        return {
          qrImage: laQrImage,
          nroTransaccion: nroTransaccion
        };
      }

    } catch (error) {
      console.error('Error en la generación de cobro', error);
      throw new Error('Error en la generación de cobro');
    }
  }

  // Método simulado para realizar la solicitud HTTP (utilizando fetch como ejemplo)
  async httpPost(url: string, headers: any, body: any): Promise<any> {
    const response = await fetch(url, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(body)
    });
    return response.json();
  }

  // Método simulado para generar un número de pago aleatorio (similar a PHP)
  generarNroPago(): number {
    let nroPago = Math.floor(Math.random() * 900000) + 100000; // Genera un número entre 100000 y 999999
    return nroPago;
  }


}
