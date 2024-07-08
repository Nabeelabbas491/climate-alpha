// nonce.service.ts
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class NonceService {
  getNonce(): string {
    const meta = document.getElementById('AA');
    return meta ? meta.getAttribute('nonce') || '' : '';
  }
}