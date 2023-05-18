import React, { useState, useEffect } from 'react';
import './App.scss';

import usersFromServer from './api/users';
import categoriesFromServer from './api/categories';
import productsFromServer from './api/products';

const products = productsFromServer.map((product) => {
  const category = categoriesFromServer
    .find(cat => cat.id === product.categoryId);
  const user = usersFromServer.find(person => person.id === category.ownerId); //

  return { ...product, category, user };
});

export const App = () => {
  const [activeFilter, setActiveFilter] = useState('all');
  const [filteredProducts, setFilteredProducts] = useState(products);
  const [query, setQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState([]);

  useEffect(() => {
    setFilteredProducts(products
      .filter(product => product.name.toLowerCase()
        .includes(query.toLowerCase())));
  }, [query]);

  const filterProductsByUser = (name) => {
    setFilteredProducts(products
      .filter(product => product.user.name === name));
    setActiveFilter(name);
  };

  const handleReset = () => {
    setFilteredProducts(products);
    setActiveFilter('all');
    setQuery('');
  };

  const handleQueryChange = (event) => {
    setQuery(event.target.value.trim());
  };

  const clearQuery = () => {
    setQuery('');
  };

  const selectCategory = (id) => {
    if (!selectedCategory.includes(id)) {
      setSelectedCategory(prevState => [...prevState, id]);
    } else {
      setSelectedCategory(prevState => prevState.filter(prev => prev !== id));
    }

    setFilteredProducts(products
      .filter(product => selectedCategory.includes(product.categoryId)));
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
                onClick={handleReset}
                className={activeFilter === 'all' ? 'is-active' : ''}
              >
                All
              </a>
              {usersFromServer.map(user => (
                <a
                  data-cy="FilterUser"
                  href="#/"
                  onClick={() => filterProductsByUser(user.name)}
                  key={user.id}
                  className={activeFilter === user.name ? 'is-active' : ''}
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
                  onChange={handleQueryChange}
                />

                <span className="icon is-left">
                  <i className="fas fa-search" aria-hidden="true" />
                </span>

                {query && (
                <span className="icon is-right">
                  <button
                    onClick={clearQuery}
                    data-cy="ClearButton"
                    type="button"
                    className="delete"
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
                onClick={handleReset}
              >
                All
              </a>
              {categoriesFromServer.map(category => (
                <a
                  data-cy="Category"
                  className={`button mr-2 my-1 ${selectedCategory.includes(category.id) ? 'is-info' : ''}`}
                  href="#/"
                  key={category.id}
                  onClick={() => selectCategory(category.id)}
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
                onClick={handleReset}
              >
                Reset all filters
              </a>
            </div>
          </nav>
        </div>

        <div className="box table-container">
          {!filteredProducts.length
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
                            {/* eslint-disable-next-line max-len */}
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
                  {filteredProducts.map((product) => {
                    const { category, name, id, user } = product;

                    return (
                      <tr data-cy="Product" key={id}>
                        {/* eslint-disable-next-line max-len */}
                        <td className="has-text-weight-bold" data-cy="ProductId">
                          {id}
                        </td>

                        <td data-cy="ProductName">{name}</td>
                        <td data-cy="ProductCategory">
                          {category.icon}
                          {' '}
                          -
                          {' '}
                          {category.title}
                        </td>

                        <td
                          data-cy="ProductUser"
                          className={user.sex === 'f'
                            ? 'has-text-danger'
                            : 'has-text-link'}
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
