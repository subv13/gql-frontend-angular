import {Component, OnDestroy, OnInit} from '@angular/core';
import {ClrDatagridStateInterface} from '@clr/angular';
import gql from 'graphql-tag';
import {Subscription} from 'rxjs';
import {Apollo} from 'apollo-angular';
import {Products} from '../generated/Products';
import {AppQuery} from "../generated/AppQuery";

type Product = {
  id: number;
  name: string;
  category: string;
};

const PRODUCTS_FRAGMENT = gql`
  fragment Products on ProductsPage {
    objectList {
      id
      name
      category
    }
    pageNumber
    paginator {
      perPage
      numPages
      count
    }
  }
`;

const ME_FRAGMENT = gql`
  fragment Me on User {
    id
    username
    firstName
    lastName
  }
`;

const PRODUCTS_QUERY = gql`
  query AppQuery($currentPage: Int!) {
    products(page: $currentPage, perPage: 5, sorters: {field: ID, order: DESC}) {
      ...Products
    }
    me {
      ...Me
    }
  }
  ${PRODUCTS_FRAGMENT}
  ${ME_FRAGMENT}
`;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'gql-frontend-angular';

  username = 'Василий';
  products: Products;
  total: 0;

  loading = true;

  private querySubscription: Subscription;

  constructor(private apollo: Apollo) {
  }

  refresh(state: ClrDatagridStateInterface): void {
    console.log(state);
  }

  ngOnDestroy(): void {
    this.querySubscription.unsubscribe();
  }

  ngOnInit(): void {
    console.log('INIT');
    this.querySubscription = this.apollo
      .watchQuery<AppQuery>({
        query: PRODUCTS_QUERY,
        variables: {
          currentPage: 1
        }
      })
      .valueChanges
      .subscribe(({data, loading}) => {
        this.loading = loading;
        this.products = data.products;
      });
  }
}
