import React, { useState } from 'react';
import './App.scss';

import usersFromServer from './api/users';
import categoriesFromServer from './api/categories';
import productsFromServer from './api/products';

export const App = () => {
  const [filterData, setFilterData] = useState('');
  // eslint-disable-next-line no-unused-vars
  const [filterByUser, setFilterByUser] = useState('');

  const combinedArray = productsFromServer.map((product) => {
    const category = categoriesFromServer
      .find(cat => product.categoryId === cat.id);
    const user = usersFromServer
      .find(usr => category.ownerId === usr.id);

    return {
      ...category,
      product: product ? product.name : null,
      user: user ? user.name : null,
      sex: user ? user.sex : null,
    };
  });

  let copyOfCombinedArray = combinedArray;

  const trimmedFilterData = filterData.trim().replace(/\s+/g, ' ');

  if (trimmedFilterData) {
    copyOfCombinedArray = copyOfCombinedArray.filter(({ product, user }) => {
      const foundElem = `
      ${product}
      ${user || ''}
     `.toLowerCase();

      return foundElem.includes(trimmedFilterData);
    });
  }

  const useSexClass = copyOfCombinedArray
    .map(elem => (elem.sex === 'f' ? 'has-text-danger' : 'has-text-link'));

  const handleFilterByUser = (selectedUser) => {
    copyOfCombinedArray = copyOfCombinedArray
      .filter(a => a.ownerId === selectedUser)
      .sort((a, b) => b.id - a.id);
  };

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
                onClick={() => handleFilterByUser('')}
              >
                All
              </a>

              <a
                data-cy="FilterUser"
                href="#/"
                onClick={() => handleFilterByUser(1)}
              >
                User 1
              </a>

              <a
                data-cy="FilterUser"
                href="#/"
                className="is-active"
                onClick={() => handleFilterByUser(2)}
              >
                User 2
              </a>

              <a
                data-cy="FilterUser"
                href="#/"
                onClick={() => handleFilterByUser(3)}
              >
                User 3
              </a>
            </p>

            <div className="panel-block">
              <p className="control has-icons-left has-icons-right">
                <input
                  data-cy="SearchField"
                  type="text"
                  className="input"
                  placeholder="Search"
                  value={filterData}
                  onChange={event => setFilterData(event.target.value)}
                />

                <span className="icon is-left">
                  <i className="fas fa-search" aria-hidden="true" />
                </span>

                <span className="icon is-right">
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
                className="button mr-2 my-1 is-outlined"
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
              {copyOfCombinedArray.map((user, index) => (
                // eslint-disable-next-line react/no-array-index-key
                <tr data-cy="Product" key={index}>
                  <td className="has-text-weight-bold" data-cy="ProductId">
                    {index + 1}
                  </td>
                  <td data-cy="ProductName">{user.product}</td>
                  <td data-cy="ProductCategory">
                    {user.icon}
                    {' '}
                    -
                    {' '}
                    {user.title}
                  </td>
                  <td data-cy="ProductUser" className={useSexClass[index]}>
                    {user.user}
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
