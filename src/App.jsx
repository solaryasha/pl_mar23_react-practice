/* eslint-disable jsx-a11y/accessible-emoji */
import React, { useState } from 'react';
import './App.scss';
import { Table } from './components/table';

import usersFromServer from './api/users';
import categoriesFromServer from './api/categories';
import productsFromServer from './api/products';

const products = productsFromServer.map((product) => {
  const category = categoriesFromServer
    .find(currCategory => currCategory.id === product.categoryId);

  if (!category) {
    return null;
  }

  const user = usersFromServer
    .find(currUser => currUser.id === category.ownerId);

  return {
    ...product,
    user,
    category,
  };
}).filter(Boolean);

export const App = () => {
  const [selectedUser, setSelectedUser] = useState('');
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [inputQuery, setInputQuery] = useState('');

  let selectedProducts = products;

  if (selectedUser) {
    selectedProducts = selectedProducts
      .filter(product => product.user.name === selectedUser);
  }

  if (inputQuery) {
    selectedProducts = selectedProducts
      .filter(product => product.name
        .toLowerCase()
        .includes(inputQuery.trim().toLowerCase()));
  }

  if (selectedCategories.length) {
    selectedProducts = selectedProducts
      .filter(product => selectedCategories.includes(product.category.title));
  }

  const toggleCategories = (category) => {
    if (selectedCategories.includes(category.title)) {
      setSelectedCategories(selectedCategories
        .filter(selectedCategory => (
          selectedCategory !== category.title)));
    } else {
      setSelectedCategories([...selectedCategories,
        category.title]);
    }
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
                className={`${!selectedUser && 'is-active'}`}
                onClick={() => {
                  setSelectedUser('');
                }}
              >
                All
              </a>
              {usersFromServer.map(user => (
                <a
                  key={user.id}
                  data-cy="FilterUser"
                  href={`#${user.name}`}
                  className={`${selectedUser === user.name && 'is-active'}`}
                  onClick={() => {
                    setSelectedUser(user.name);
                  }}

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
                  value={inputQuery}
                  onChange={event => setInputQuery(event.target.value)}
                />

                <span className="icon is-left">
                  <i className="fas fa-search" aria-hidden="true" />
                </span>

                <span className="icon is-right">
                  {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
                  {inputQuery && (
                  <button
                    data-cy="ClearButton"
                    type="button"
                    className="delete"
                    onClick={() => setInputQuery('')}
                  />
                  )}
                </span>
              </p>
            </div>

            <div className="panel-block is-flex-wrap-wrap">
              <a
                href="#/"
                data-cy="AllCategories"
                className={`button is-success mr-6 ${selectedCategories.length && 'is-outlined'}`}
                onClick={() => {
                  setSelectedCategories([]);
                }}
              >
                All
              </a>
              {categoriesFromServer.map(category => (
                <a
                  data-cy="Category"
                  className={`button mr-2 my-1 ${selectedCategories.includes(category.title) && 'is-info'}`}
                  href={`#${selectedCategories}`}
                  onClick={() => {
                    toggleCategories(category);
                  }}
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
                onClick={() => {
                  setSelectedUser('');
                  setSelectedCategories('');
                }}
              >
                Reset all filters
              </a>
            </div>
          </nav>
        </div>

        <div className="box table-container">
          {
            !selectedProducts.length ? (
              <p data-cy="NoMatchingMessage">
                No products matching selected criteria
              </p>
            ) : (
              <Table products={selectedProducts} />
            )
         }

        </div>
      </div>
    </div>
  );
};
