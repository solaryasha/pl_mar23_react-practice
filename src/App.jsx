import React, { useState } from 'react';
import './App.scss';

import usersFromServer from './api/users';
import categoriesFromServer from './api/categories';
import productsFromServer from './api/products';

const products = productsFromServer.map((product) => {
  const category = categoriesFromServer
    .find(categories => categories.id === product.categoryId);
  const user = usersFromServer.find(users => users.id === category.ownerId);

  return {
    ...product,
    category,
    user,
  };
});

export const App = () => {
  const [query, setQuery] = useState('');
  const [selectedUser, setSelectedUser] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  let visibleProducts = products;

  if (query) {
    visibleProducts = visibleProducts.filter(
      (product) => {
        const lowerQuery = query.toLowerCase();
        const hasProductName = product.name.toLowerCase()
          .includes(lowerQuery);

        return hasProductName;
      },
    );
  }

  if (selectedUser) {
    visibleProducts = visibleProducts.filter(
      (product) => {
        const hasUserName = product.user.name === selectedUser.name;

        return hasUserName;
      },
    );
  }

  if (selectedCategory) {
    visibleProducts = visibleProducts.filter(
      (product) => {
        const hasCategory = product.category.title === selectedCategory.title;

        return hasCategory;
      },
    );
  }

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
                className={!selectedUser && 'is-active'}
                onClick={() => setSelectedUser('')}
              >
                All
              </a>

              {usersFromServer.map((user) => {
                const { name } = user;

                return (
                  <a
                    data-cy="FilterUser"
                    href="#/"
                    className={selectedUser
                      && (selectedUser.name === name && 'is-active')}
                    onClick={() => setSelectedUser(user)}
                  >
                    {name}
                  </a>
                );
              })}
            </p>

            <div className="panel-block">
              <p className="control has-icons-left has-icons-right">
                <input
                  data-cy="SearchField"
                  type="text"
                  className="input"
                  placeholder="Search"
                  value={query}
                  onChange={(event) => {
                    setQuery(event.target.value);
                  }}
                />

                <span className="icon is-left">
                  <i className="fas fa-search" aria-hidden="true" />
                </span>

                {query && (
                  <span className="icon is-right">
                    {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
                    <button
                      data-cy="ClearButton"
                      type="button"
                      className="delete"
                      onClick={() => {
                        setQuery('');
                      }}
                    />
                  </span>
                )}
              </p>
            </div>

            <div className="panel-block is-flex-wrap-wrap">
              <a
                href="#/"
                data-cy="AllCategories"
                className={selectedCategory
                  ? 'button is-success mr-6 is-outlined'
                  : 'button is-success mr-6'}
                onClick={() => setSelectedCategory('')}
              >
                All
              </a>

              {categoriesFromServer.map((category) => {
                const { title } = category;

                return (
                  <a
                    data-cy="Category"
                    className={category.title === selectedCategory.title
                      ? 'button mr-2 my-1 is-info'
                      : 'button mr-2 my-1'}
                    href="#/"
                    onClick={() => setSelectedCategory(category)}
                  >
                    {title}
                  </a>
                );
              })}
            </div>

            <div className="panel-block">
              <a
                data-cy="ResetAllButton"
                href="#/"
                className="button is-link is-outlined is-fullwidth"
                onClick={() => {
                  setQuery('');
                  setSelectedUser('');
                  setSelectedCategory('');
                }}
              >
                Reset all filters
              </a>
            </div>
          </nav>
        </div>

        <div className="box table-container">
          {!visibleProducts.length
            ? (
              <p data-cy="NoMatchingMessage">
                No products matching selected criteria
              </p>
            )
            : (
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
                            <i
                              data-cy="SortIcon"
                              className="fas fa-sort-down"
                            />
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

                  {visibleProducts.map((product) => {
                    const { id, name, category, user } = product;

                    return (
                      <tr data-cy="Product">
                        <td
                          className="has-text-weight-bold"
                          data-cy="ProductId"
                        >
                          {id}
                        </td>

                        <td data-cy="ProductName">{name}</td>
                        <td data-cy="ProductCategory">{`${category.icon} - ${category.title}`}</td>

                        <td
                          data-cy="ProductUser"
                          className={user.sex === 'm'
                            ? 'has-text-link'
                            : 'has-text-danger'}
                        >
                          {user.name}
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
