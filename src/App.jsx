import React, { useState } from 'react';
import './App.scss';

import usersFromServer from './api/users';
import categoriesFromServer from './api/categories';
import productsFromServer from './api/products';

// const products = productsFromServer.map((product) => {
//   const category = null; // find by product.categoryId
//   const user = null; // find by category.ownerId

//   return null;
// });

let category = 0;
let owner = 0;

export function sorting() {
  let copy = [...productsFromServer];
  let categories = [...categoriesFromServer];

  if (category !== 0) {
    copy = copy.filter(product => product.categoryId === category);
  }

  if (owner !== 0) {
    categories = categories.filter(categ => categ.ownerId === owner);
    const arr = [];

    categories.map(categ => arr.push(categ.ownerId));

    copy = copy.filter(product => arr.includes(product.categoryId));
  }

  return copy;
}

export const App = () => {
  const [categ2, setCategory] = useState(0);
  const [own, setOwner] = useState(0);

  category = categ2;
  owner = own;

  const table = sorting();

  return (
    <div className="section">
      <div className="container">
        <h1 className="title">Product Categories</h1>

        <div className="block">
          <nav className="panel">
            <p className="panel-heading">Filters</p>

            <p className="panel-tabs has-text-weight-bold">
              <a
                data-cy="FilterAllUsers"
                href="#/"
                onClick={() => setOwner(0)}
              >
                All
              </a>

              <a
                data-cy="FilterUser"
                href="#/"
                onClick={() => setOwner(1)}
              >
                Roma
              </a>

              <a
                data-cy="FilterUser"
                href="#/"
                className="is-active"
                onClick={() => setOwner(2)}
              >
                Anna
              </a>

              <a
                data-cy="FilterUser"
                href="#/"
                onClick={() => setOwner(3)}
              >
                Max
              </a>

              <a
                data-cy="FilterUser"
                href="#/"
                onClick={() => setOwner(4)}
              >
                John
              </a>
            </p>

            <div className="panel-block">
              <p className="control has-icons-left has-icons-right">
                <input
                  data-cy="SearchField"
                  type="text"
                  className="input"
                  placeholder="Search"
                  value=""
                />

                <span className="icon is-left">
                  <i className="fas fa-search" aria-hidden="true" />
                </span>

                <span className="icon is-right">
                  {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
                  <button
                    data-cy="ClearButton"
                    type="button"
                    className="delete"
                  />
                </span>
              </p>
            </div>

            <div className="panel-block is-flex-wrap-wrap">
              <a
                href="#/"
                data-cy="AllCategories"
                className="button is-success mr-6 is-outlined"
                onClick={() => setCategory(0)}
              >
                All
              </a>

              <a
                data-cy="Category"
                className="button mr-2 my-1 is-info"
                href="#/"
                onClick={() => setCategory(1)}
              >
                Grocery
              </a>

              <a
                data-cy="Category"
                className="button mr-2 my-1"
                href="#/"
                onClick={() => setCategory(2)}
              >
                Drinks
              </a>

              <a
                data-cy="Category"
                className="button mr-2 my-1 is-info"
                href="#/"
                onClick={() => setCategory(3)}
              >
                Fruits
              </a>

              <a
                data-cy="Category"
                className="button mr-2 my-1"
                href="#/"
                onClick={() => setCategory(4)}
              >
                Electronics
              </a>

              <a
                data-cy="Category"
                className="button mr-2 my-1"
                href="#/"
                onClick={() => setCategory(5)}
              >
                Clothes
              </a>
            </div>

            <div className="panel-block">
              <a
                data-cy="ResetAllButton"
                href="#/"
                className="button is-link is-outlined is-fullwidth"
                // onClick={}
              >
                Reset all filters
              </a>
            </div>
          </nav>
        </div>

        <div className="box table-container">
          <p data-cy="NoMatchingMessage">
            No products matching selected criteria
          </p>

          <table
            data-cy="ProductTable"
            className="table is-striped is-narrow is-fullwidth"
          >
            <thead>
              <tr>
                <th>
                  <span className="is-flex is-flex-wrap-nowrap">
                    ID

                    <a href="#/">
                      <span className="icon">
                        <i data-cy="SortIcon" className="fas fa-sort" />
                      </span>
                    </a>
                  </span>
                </th>

                <th>
                  <span className="is-flex is-flex-wrap-nowrap">
                    Product

                    <a href="#/">
                      <span className="icon">
                        <i data-cy="SortIcon" className="fas fa-sort-down" />
                      </span>
                    </a>
                  </span>
                </th>

                <th>
                  <span className="is-flex is-flex-wrap-nowrap">
                    Category

                    <a href="#/">
                      <span className="icon">
                        <i data-cy="SortIcon" className="fas fa-sort-up" />
                      </span>
                    </a>
                  </span>
                </th>

                <th>
                  <span className="is-flex is-flex-wrap-nowrap">
                    User

                    <a href="#/">
                      <span className="icon">
                        <i data-cy="SortIcon" className="fas fa-sort" />
                      </span>
                    </a>
                  </span>
                </th>
              </tr>
            </thead>

            <tbody>
              {table.map(product => (
                <tr data-cy="Product">
                  <td className="has-text-weight-bold" data-cy="ProductId">
                    {product.id}
                  </td>

                  <td data-cy="ProductName">{product.name}</td>
                  {/* <span data-cy="ProductCategory">🍺 - Drinks</span> */}

                  <td
                    data-cy="ProductUser"
                    className="has-text-link"
                  >
                    {usersFromServer
                      .find(person => person.id === categoriesFromServer
                        .find(categ => categ.id === product.categoryId)
                        .ownerId).name}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
