import React, { useState } from 'react';
import classNames from 'classnames';
import './App.scss';

import usersFromServer from './api/users';
import categoriesFromServer from './api/categories';
import productsFromServer from './api/products';

export const App = () => {
  const [selectedOwner, setSelectedOwner] = useState(null);
  const [searchValue, setSearchValue] = useState('');

  const filteredProducts = selectedOwner
    ? productsFromServer.filter((product) => {
      const serverCategory = categoriesFromServer.find(
        category => category.id === product.categoryId,
      );
      const userCategory = usersFromServer.find(
        user => user.id === serverCategory.ownerId,
      );

      return userCategory.id === selectedOwner;
    })
    : productsFromServer;

  const handleOwnerFilter = (ownerId) => {
    setSelectedOwner(ownerId);
  };

  const handleSearchInputChange = (event) => {
    setSearchValue(event.target.value);
  };

  const productsFiltered = filteredProducts.filter(product => product.name.toLowerCase().includes(searchValue.toLowerCase()));

  const products = productsFiltered.map((product) => {
    const productCategory = categoriesFromServer.find(
      category => category.id === product.categoryId,
    );
    const userCategory = usersFromServer.find(
      user => user.id === productCategory.ownerId,
    );

    return (
      <tr data-cy="Product" key={product.id}>
        <td className="has-text-weight-bold" data-cy="ProductId">
          {product.id}
        </td>

        <td data-cy="ProductName">{product.name}</td>
        <td data-cy="ProductCategory">
          {productCategory.icon}
          -
          {productCategory.title}
        </td>

        <td
          data-cy="ProductUser"
          className={classNames({
            'has-text-link': userCategory.sex === 'm',
            'has-text-danger': userCategory.sex === 'f',
          })}
        >
          {userCategory.name}
        </td>
      </tr>
    );
  });

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
                className={!selectedOwner ? 'is-active' : ''}
                onClick={() => handleOwnerFilter(null)}
              >
                All
              </a>

              {usersFromServer.map(user => (
                <a
                  key={user.id}
                  data-cy="FilterUser"
                  href="#/"
                  className={selectedOwner === user.id ? 'is-active' : ''}
                  onClick={() => handleOwnerFilter(user.id)}
                >
                  {user.name}
                </a>
              ))}
            </p>

            <div className="panel-block">
              <p className="control has-icons-left has-icons-right">
                <input
                  data-cy="SearchField"
                  type="text"
                  className="input"
                  placeholder="Search"
                  value={searchValue}
                  onChange={handleSearchInputChange}
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
              >
                All
              </a>

              <a
                data-cy="Category"
                className="button mr-2 my-1 is-info"
                href="#/"
              >
                Category 1
              </a>

              <a
                data-cy="Category"
                className="button mr-2 my-1"
                href="#/"
              >
                Category 2
              </a>

              <a
                data-cy="Category"
                className="button mr-2 my-1 is-info"
                href="#/"
              >
                Category 3
              </a>
              <a
                data-cy="Category"
                className="button mr-2 my-1"
                href="#/"
              >
                Category 4
              </a>
            </div>

            <div className="panel-block">
              <a
                data-cy="ResetAllButton"
                href="#/"
                className="button is-link is-outlined is-fullwidth"
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
              {products}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
