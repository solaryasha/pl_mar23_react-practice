import React, { useState, useEffect } from 'react';
import './App.scss';
import { Product } from './Components/Product';

import usersFromServer from './api/users';
import categoriesFromServer from './api/categories';
import productsFromServer from './api/products';

// const products = productsFromServer.map((product) => {
//   const category = null; // find by product.categoryId
//   const user = null; // find by category.ownerId

//   return null;
// });

const products = productsFromServer.map((product) => {
  const currentCategory = categoriesFromServer.find(category => (
    product.categoryId === category.id
  ));

  const currentUser = usersFromServer.find(user => (
    user.id === currentCategory.ownerId
  ));

  return {
    id: product.id,
    name: product.name,
    category: {
      title: currentCategory.title,
      icon: currentCategory.icon,
    },
    user: {
      name: currentUser.name,
      sex: currentUser.sex,
    },
  };
});

export const App = () => {
  const [userSelected, setUserSelected] = useState('');
  const [elements, setElements] = useState(products);
  const [searchValue, setSearchValue] = useState('');

  useEffect(() => {
    const filteredElements = products.filter(product => (
      (userSelected === '' || product.user.name === userSelected)
      && product.name?.toLowerCase().includes(searchValue?.toLowerCase())
    ));

    setElements(filteredElements);
  }, [userSelected, searchValue]);

  const handleUserSelect = (user) => {
    setUserSelected(user);
  };

  const handleSearchChange = (event) => {
    const { value } = event.target;

    setSearchValue(value);
  };

  const handleSearchClear = () => {
    setSearchValue('');
  };

  const handleResetFilters = () => {
    setUserSelected('');
    setElements(products);
    setSearchValue('');
  };

  const productElements = elements.map(product => (
    <Product product={product} key={product.name} />
  ));

  const users = usersFromServer.map(user => (
    <a
      data-cy="FilterUser"
      href="#/"
      key={user.name}
      className={user.name === userSelected ? 'is-active' : ''}
      onClick={() => handleUserSelect(user.name)}
    >
      {user.name}
    </a>
  ));

  users.unshift(
    <a
      data-cy="FilterAllUsers"
      href="#/"
      className={userSelected.length === 0 && 'is-active'}
      onClick={() => handleUserSelect('')}
    >
      All
    </a>,
  );

  return (
    <div className="section">
      <div className="container">
        <h1 className="title">Product Categories</h1>

        <div className="block">
          <nav className="panel">
            <p className="panel-heading">Filters</p>

            <p className="panel-tabs has-text-weight-bold">
              {users}
            </p>

            <div className="panel-block">
              <p className="control has-icons-left has-icons-right">
                <input
                  data-cy="SearchField"
                  type="text"
                  className="input"
                  placeholder="Search"
                  value={searchValue}
                  onChange={handleSearchChange}
                />

                <span className="icon is-left">
                  <i className="fas fa-search" aria-hidden="true" />
                </span>

                {searchValue.length > 0
                  && (
                    <span className="icon is-right">
                      {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
                      <button
                        data-cy="ClearButton"
                        type="button"
                        className="delete"
                        onClick={handleSearchClear}
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
                onClick={handleResetFilters}
              >
                Reset all filters
              </a>
            </div>
          </nav>
        </div>

        <div className="box table-container">
          {productElements.length
            ? (
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
                  {productElements}
                </tbody>
              </table>
            ) : (
              <p data-cy="NoMatchingMessage">
                No products matching selected criteria
              </p>
            )}

        </div>
      </div>
    </div>
  );
};
