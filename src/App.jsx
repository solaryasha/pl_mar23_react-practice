import React, { useState } from 'react';
import './App.scss';

import usersFromServer from './api/users';
import categoriesFromServer from './api/categories';
import productsFromServer from './api/products';

const products = productsFromServer.map((product) => {
  const category = categoriesFromServer
    .find(item => item.id === product.categoryId);
  const user = usersFromServer
    .find(item => item.id === category?.ownerId);

  return { ...product, category, user };
});

export const App = () => {
  const [query, setQuery] = useState('');
  const [userId, setUserId] = useState(0);
  const [category, setCategory] = useState([]);

  const handleInput = (event) => {
    setQuery(event.target.value);
  };

  const addCategory = (categorys) => {
    setCategory(currentCategory => (
      [...currentCategory, category]
    ));
  };

  const removeCategory = (category) => {
    setCategory(currentCategory => (
      currentCategory.filter(item => item !== category)
    ));
  };

  const resetFilter = () => {
    setUserId(0);
    setQuery('');
    setCategory([]);
  };

  let productsApi = [...products];

  // if (userId) {
  //   productsApi = productsApi.filter(item=> item.user.id === userId,
  //   );
  // }

  // if (query) {
  //   const upperQuery = query.toUpperCase();
  // }

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
                onClick={() => setUserId(0)}
                className={`${userId === 0 && 'is-active'}`}
              >
                All
              </a>

              {usersFromServer.map(user => (
                <a
                  key={user.id}
                  data-cy="FilterUser"
                  href="#/"
                  onClick={() => setUserId(user.id)}
                  className={`${user.id === userId && 'is-active'}`}
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
                  onChange={handleInput}
                />

                <span className="icon is-left">
                  <i className="fas fa-search" aria-hidden="true" />
                </span>

                {query && (
                  <span className="icon is-right">
                    <button
                      className="delete"
                      data-cy="ClearButton"
                      type="button"
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
                className={`button is-success mr-6 ${category.length !== 0 && 'is-outlined'}`}
                onClick={() => setCategory([])}
              >
                All
              </a>

              {categoriesFromServer.map(category => (
                category.includes(category.id)
                  ? (
                    <a
                      key={category.id}
                      data-cy="Category"
                      className="button mr-2 my-1 is-info"
                      href="#/"
                      onClick={() => removeCategory(category.id)}
                    >
                      {category.title}
                    </a>
                  )
                  : (
                    <a
                      key={category.id}
                      data-cy="Category"
                      className="button mr-2 my-1"
                      href="#/"
                      onClick={() => addCategory(category.id)}
                    >
                      {category.title}
                    </a>
                  )

              ))}
            </div>

            <div className="panel-block">
              <a
                data-cy="ResetAllButton"
                href="#/"
                className="button is-link is-outlined is-fullwidth"
                onClick={resetFilter}
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
              <tr data-cy="Product">
                <td className="has-text-weight-bold" data-cy="ProductId">
                  1
                </td>

                <td data-cy="ProductName">Milk</td>
                <td data-cy="ProductCategory">🍺 - Drinks</td>

                <td
                  data-cy="ProductUser"
                  className="has-text-link"
                >
                  Max
                </td>
              </tr>

              <tr data-cy="Product">
                <td className="has-text-weight-bold" data-cy="ProductId">
                  2
                </td>

                <td data-cy="ProductName">Bread</td>
                <td data-cy="ProductCategory">🍞 - Grocery</td>

                <td
                  data-cy="ProductUser"
                  className="has-text-danger"
                >
                  Anna
                </td>
              </tr>

              <tr data-cy="Product">
                <td className="has-text-weight-bold" data-cy="ProductId">
                  3
                </td>

                <td data-cy="ProductName">iPhone</td>
                <td data-cy="ProductCategory">💻 - Electronics</td>

                <td
                  data-cy="ProductUser"
                  className="has-text-link"
                >
                  Roma
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
