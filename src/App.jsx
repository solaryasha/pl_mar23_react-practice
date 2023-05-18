import React, { useState } from 'react';
import './App.scss';
// import classNames from 'classnames';
import usersFromServer from './api/users';
import categoriesFromServer from './api/categories';
import productsFromServer from './api/products';
import { Product } from './Components/Product';

const products = productsFromServer.map((product) => {
  // eslint-disable-next-line
  const category = categoriesFromServer.find(cat => cat.id === product.categoryId) || null; // find by product.categoryId
  // eslint-disable-next-line
  const user = usersFromServer.find(user => user.id === category?.ownerId) || null; // find by category.ownerId

  return {
    ...product,
    category,
    user,
  };
});

export const App = () => {
  const [query, setQuery] = useState('');
  const queryLowerCase = query.toLowerCase().trim();

  const matchingProducst = products.filter(prod => (
    prod.name.toLowerCase().includes(queryLowerCase)
  ));

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
                className="is-success"
              >
                All
              </a>
              {usersFromServer.map(user =>
                // eslint-disable-next-line
                <a key={user.id}
                  data-cy="FilterUser"
                  href="#/"
                >
                  {user.name}
                </a>)
              }
            </p>

            <div className="panel-block">
              <p className="control has-icons-left has-icons-right">
                <input
                  data-cy="SearchField"
                  type="text"
                  className="input"
                  value={query}
                  onChange={(event) => {
                    setQuery(event.target.value);
                  }}
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
                    onClick={(event) => {
                      setQuery('');
                    }}
                  />
                </span>
              </p>
            </div>

            <div className="panel-block is-flex-wrap-wrap">
              <a
                href="#/"
                data-cy="AllCategories"
                className="button is-success mr-6 is-outlined is-info"
              >
                All
              </a>
              {categoriesFromServer.map(category =>
                // eslint-disable-next-line
                <a
                  data-cy="Category"
                  className="button mr-2 my-1"
                  href="#/"
                  key={category.id}
                >
                  {category.title}
                </a>)
              }
            </div>

            <div className="panel-block">
              <a
                data-cy="ResetAllButton"
                href="#/"
                className="button is-link is-outlined is-fullwidth"
                onClick={(event) => {
                  setQuery('');
                }}
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
              {matchingProducst.map(product =>
                // eslint-disable-next-line
                <Product
                  id={product.id}
                  productName={product.name}
                  category={product.category}
                  user={product.user}
                />)
              }
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
