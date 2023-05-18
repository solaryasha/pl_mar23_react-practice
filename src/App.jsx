import { React, useState, useEffect } from 'react';
import './App.scss';

import usersFromServer from './api/users';
import categoriesFromServer from './api/categories';
// import productsFromServer from './api/products';

import products from './utils/fullProductsList';

export const App = () => {
  const [selectedUser, setSelectedUser] = useState(0);
  const [selectedProducts, setSelectedProducts] = useState(products);
  const [searchBarValue, setSearchBarValue] = useState('');
  const [selectedCategories, setSelectedCategories] = useState([]);

  const handleSelectedUser = (userId) => {
    setSelectedUser(userId);

    if (userId === 0) {
      setSelectedProducts(products);
    } else {
      setSelectedProducts(
        products.filter(product => product.user.id === userId),
      );
    }
  };

  const handleInputSearch = (event) => {
    const { value } = event.target;

    setSearchBarValue(value);

    setSelectedProducts(
      products.filter(product => (
        product.name.toLowerCase().includes(value.toLowerCase())
      )),
    );
  };

  const handleResetAll = () => {
    setSelectedUser(0);
    setSelectedProducts(products);
    setSearchBarValue('');
  };

  const handleCategorySelection = (categoryId) => {
    if (categoryId === 0) {
      setSelectedCategories([]);
    } else if (selectedCategories.includes(categoryId)) {
      setSelectedCategories(prev => (
        prev.filter(category => category !== categoryId)
      ));
    } else {
      setSelectedCategories(state => (
        [...state, categoryId]
      ));
    }
  };

  useEffect(() => {
    if (selectedCategories.length === 0) {
      setSelectedProducts(products);
    } else {
      setSelectedProducts(
        products.filter(product => (
          selectedCategories.includes(product.category.id)
        )),
      );
    }
  }, [selectedCategories]);
  const handleSortBy = () => {
    setSelectedProducts(prev => (
      [...prev].sort((a, b) => a.name.localeCompare(b.name))
    ));
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
                onClick={() => handleSelectedUser(0)}
              >
                All
              </a>

              {usersFromServer.map(user => (
                <a
                  data-cy="FilterUser"
                  href="#/"
                  className={user.id === selectedUser ? 'is-active' : ''}
                  onClick={() => handleSelectedUser(user.id)}
                  key={user.id}
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
                  value={searchBarValue}
                  onChange={handleInputSearch}
                />

                <span className="icon is-left">
                  <i className="fas fa-search" aria-hidden="true" />
                </span>

                <span className="icon is-right">
                  {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
                  {searchBarValue !== '' && (
                    <button
                      data-cy="ClearButton"
                      type="button"
                      className="delete"
                      value=""
                      onClick={handleInputSearch}
                    />
                  )}
                </span>
              </p>
            </div>

            <div className="panel-block is-flex-wrap-wrap">
              <a
                href="#/"
                data-cy="AllCategories"
                className={`button is-success mr-6 ${selectedCategories.length !== 0 ? 'is-outlined' : ''}`}
                onClick={() => handleCategorySelection(0)}
              >
                All
              </a>

              {categoriesFromServer.map(category => (
                <a
                  data-cy="Category"
                  className={`button mr-2 my-1 ${selectedCategories.includes(category.id) ? 'is-info' : ''}`}
                  href="#/"
                  onClick={() => handleCategorySelection(category.id)}
                  key={category.id}
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
                onClick={handleResetAll}
              >
                Reset all filters
              </a>
            </div>
          </nav>
        </div>

        <div className="box table-container">
          {
            selectedProducts.length === 0
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

                          <a
                            href="#/"
                            onClick={handleSortBy}
                          >
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
                              <i
                                data-cy="SortIcon"
                                className="fas fa-sort-up"
                              />
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
                      selectedProducts.map(product => (
                        <tr data-cy="Product" key={product.id}>
                          <td
                            className="has-text-weight-bold"
                            data-cy="ProductId"
                          >
                            {product.id}
                          </td>

                          <td data-cy="ProductName">{product.name}</td>
                          <td data-cy="ProductCategory">{`${product.category.icon} - ${product.category.title}`}</td>

                          <td
                            data-cy="ProductUser"
                            className={product.user.sex === 'm'
                              ? 'has-text-link'
                              : 'has-text-danger'}
                          >
                            {product.user.name}
                          </td>
                        </tr>
                      ))
                    }
                  </tbody>
                </table>
              )
          }
        </div>
      </div>
    </div>
  );
};
