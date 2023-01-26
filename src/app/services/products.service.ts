// @angular
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpErrorResponse, HttpStatusCode } from '@angular/common/http';
// environments
import { environment } from './../../environments/environment';
// rxjs
import { retry, catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
// models
import { Product, CreateProductDTO, UpdateProductDTO } from '../models/product.module';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {

  private apiUrl = `${environment.API_URL}/api/products`;

  myPersonalProducts = [
    {
      id: 1,
      title: 'Army Of Two II',
      price: 45,
      image: '../../../assets/images/aot2.jpg'
    },
    {
      id: 2,
      title: 'inFAMOUS 2',
      price: 40,
      image: '../../../assets/images/infamous2.jpg'
    },
    {
      id: 3,
      title: 'All-Stars',
      price: 40,
      image: '../../../assets/images/allstar.jpg'
    },
    {
      id: 4,
      title: 'Minecraft',
      price: 35,
      image: '../../../assets/images/minecraft.jpg'
    },
    {
      id: 5,
      title: 'Ratchet',
      price: 25,
      image: '../../../assets/images/ratchet.jpg'
    }
  ]

  constructor(
    private http: HttpClient
  ) { }

  getAllProducts(limit?: number, offset?: number) {
    let params = new HttpParams();
    if (limit && offset){
      params = params.set('limit', limit);
      params = params.set('offset', limit)
    }
    return this.http.get<Product[]>(this.apiUrl, { params })
    .pipe(
      retry(3)
    );
  }

  getProduct(id: number) {
    return this.http.get<Product>(`${this.apiUrl}/${id}`)
    .pipe(
      catchError((error: HttpErrorResponse) => {
        if(error.status === HttpStatusCode.Conflict) {
          return throwError('Ups! Fallo en el server')
        }
        if(error.status === HttpStatusCode.NotFound) {
          return throwError('El producto no existe :(')
        }
        if(error.status === HttpStatusCode.Unauthorized) {
          return throwError('No autorizado')
        }
        return throwError('Ups! Algo salio mal :(')
      })
    )
  }

  getProductsByPage(limit: number, offset: number){
    return this.http.get<Product[]>(`${this.apiUrl}`, {
      params: { limit, offset }
    });
  }

  create(dto: CreateProductDTO){
    return this.http.post<Product>(this.apiUrl, dto);
  }

  update(id: number, dto: UpdateProductDTO) {
    return this.http.put<Product>(`${this.apiUrl}/${id}`, dto);
  }

  delete(id: number) {
    return this.http.delete<boolean>(`${this.apiUrl}/${id}`);
  }

}
