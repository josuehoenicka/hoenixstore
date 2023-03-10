// @angular
import { Component, OnInit } from '@angular/core';
// rxjs
import { zip } from 'rxjs'
import { switchMap } from 'rxjs/operators'
// modules
import { Product, CreateProductDTO, UpdateProductDTO } from '../../models/product.model';
// services
import { StoreService } from '../../services/store.service'
import { ProductsService } from '../../services/products.service'

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})
export class ProductsComponent implements OnInit {

  myShoppingCart: Product[] = [];
  total = 0;
  products: Product[] = []
  today = new Date();
  date = new Date(2001, 8, 31);
  showProductDetail = false;
  productChosen: Product = {
    id: 0,
    title: '',
    price: 0,
    description: '',
    images: [],
    category: {
      id: 0,
      title: ''
    },
  };
  limit = 10;
  offset = 0;
  statusDetail: 'loading' | 'success' | 'error' | 'init' = 'init';

  constructor(
    private storeService: StoreService,
    private productsService: ProductsService
  ) {
    this.myShoppingCart = this.storeService.getShoppingCart();
   }

  ngOnInit(): void {
    this.productsService.getProductsByPage(10, 0)
    .subscribe(dataAPI => {
      this.products = dataAPI;
    });
  }

  addToShoppingCart(product: Product) {
    // this.myShoppingCart.push(product);
    this.storeService.addProduct(product);
    // this.total = this.myShoppingCart.reduce((sum, item) => sum + item.price, 0);
    this.total = this.storeService.getTotal();
  }

  toogleProductDetail() {
    this.showProductDetail = !this.showProductDetail;
  }

  onShowDetail(id: number) {
    this.statusDetail = 'loading';
    this.toogleProductDetail();
    this.productsService.getProduct(id)
    .subscribe(data => {
      this.productChosen = data;
      this.statusDetail = 'success';
    }, errorMsg => {
      window.alert(errorMsg);
      this.statusDetail = 'error';
    })
  }

  readAndUpdate(id: number){
    this.productsService.getProduct(id)
    .pipe (
      switchMap(
        (product) =>
          this.productsService.update(product.id, {title: 'change :)'})
      )
    )
    .subscribe(data => {
      console.log(data);
    });
    this.productsService.fetchReadAndUpdate(id, {title: 'change'})
    .subscribe(response => {
      const read = response[0];
      const update = response[1];
    })
  }

  createNewProduct(){
    const product: CreateProductDTO = {
      title: 'Nuevo Producto',
      description: '.',
      price: 1000,
      images: ['../../../assets/images/allstar.jpg'],
      categoryId: 2,
    }
    this.productsService.create(product)
    .subscribe(data =>{
      this.products.unshift(data);
    });
  }

  updateProduct() {
    const changes: UpdateProductDTO = {
      title: 'TITULO CAMBIADO'
    }
    const id = this.productChosen.id;
    this.productsService.update(id, changes)
    .subscribe(data => {
      const productIndex = this.products.findIndex(item => item.id === this.productChosen.id);
      this.products[productIndex] = data;
      this.productChosen = data;
    });
  }

  deleteProduct() {
    const id = this.productChosen.id;
    this.productsService.delete(id)
    .subscribe(data => {
      const productIndex = this.products.findIndex(item => item.id === this.productChosen.id);
      this.products.splice(productIndex, 1);
      this.showProductDetail = false;
    });
  }

  loadMore() {
    this.productsService.getProductsByPage(this.limit, this.offset)
    .subscribe(data => {
      this.products = this.products.concat(data);
      this.offset += this.limit;
    });
  }

}
