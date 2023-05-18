import React, { useState } from 'react';
import './App.scss';

import usersFromServer from './api/users';
import categoriesFromServer from './api/categories';
import productsFromServer from './api/products';

const products = productsFromServer.map((product) => {
  const foundCategory = categoriesFromServer.find(category => (
    category.id === product.categoryId
  ));

  const foundUser = usersFromServer.find(user => (
    user.id === foundCategory.ownerId
  ));

  return {
    ...product,
    foundCategory,
    foundUser,
  };
});

export const App = () => {
  const [selectedUser, setUser] = useState(0);
  const [selectedCategory, setCategory] = useState(null);
  const [query, setQuery] = useState('');

  const handleSetUser = (userId) => {
    setUser(userId);
  };

  const handleSetCategory = (categoryId) => {
    setCategory(categoryId);
  };

  const handleSetQuery = (event) => {
    setQuery(event.target.value.trimStart());
  };

  // eslint-disable-next-line arrow-body-style
  const matchesQuery = (text, searchTerm) => {
    return text.toLowerCase().includes(searchTerm.toLowerCase().trim());
  };

  const resetFilters = () => {
    setUser(0);
    setCategory(null);
    setQuery('');
  };

  const productsMatchingSearch = products.filter((product) => {
    const { name } = product;

    return matchesQuery(name, query);
  });

  // eslint-disable-next-line arrow-body-style
  const filteredProducts = productsMatchingSearch.filter((product) => {
    const { categoryId } = product;

    return (!selectedUser || product.foundUser.id === selectedUser)
    && (!selectedCategory || categoryId === selectedCategory);
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
                className={selectedUser === 0 ? 'is-active' : ''}
                onClick={() => handleSetUser(0)}
              >
                All
              </a>

              {usersFromServer.map(user => (
                <a
                  data-cy="FilterUser"
                  href="#/"
                  key={user.id}
                  className={selectedUser === user.id ? 'is-active' : ''}
                  onClick={() => handleSetUser(user.id)}
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
                  value={query}
                  onChange={handleSetQuery}
                />

                <span className="icon is-left">
                  <i className="fas fa-search" aria-hidden="true" />
                </span>

                {query !== '' && (
                  <span className="icon is-right">
                    {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
                    <button
                      data-cy="ClearButton"
                      type="button"
                      className="delete"
                      onClick={() => setQuery('')}
                    />
                  </span>
                )}
              </p>
            </div>

            <div className="panel-block is-flex-wrap-wrap">
              <a
                href="#/"
                data-cy="AllCategories"
                className="button is-success mr-6 is-outlined"
                onClick={() => handleSetCategory(null)}
              >
                All
              </a>

              {categoriesFromServer.map(category => (
                <a
                  data-cy="Category"
                  href="#/"
                  key={category.id}
                  className={selectedCategory === category.id
                    ? 'button mr-2 my-1 is-info'
                    : 'button mr-2 my-1'}
                  onClick={() => handleSetCategory(category.id)}
                >
                  {category.title}
                </a>
              ))}
            </div>

            <div className="panel-block">
              <a
                data-cy="ResetAllButton"
                href="#/"
                className="button is-link is-outlined is-fullwidth"
                onClick={resetFilters}
              >
                Reset all filters
              </a>
            </div>
          </nav>
        </div>

        <div className="box table-container">
          {filteredProducts.length === 0 ? (
            <p data-cy="NoMatchingMessage">
              No products matching selected criteria
            </p>
          ) : (
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
                {
                  filteredProducts.map((product) => {
                    const { id, name, foundCategory, foundUser } = product;

                    return (
                      <tr data-cy="Product" key={id}>
                        <td
                          className="has-text-weight-bold"
                          data-cy="ProductId"
                        >
                          {id}
                        </td>

                        <td data-cy="ProductName">{name}</td>
                        <td data-cy="ProductCategory">{`${foundCategory.icon} - ${foundCategory.title}`}</td>

                        <td
                          data-cy="ProductUser"
                          className={
                            foundUser.sex === 'm'
                              ? 'has-text-link'
                              : 'has-text-danger'
                          }
                        >
                          {foundUser.name}
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};
