import React, { useState, useMemo } from 'react';
import './App.scss';
import cn from 'classnames';

import usersFromServer from './api/users';
import categoriesFromServer from './api/categories';
import productsFromServer from './api/products';

const products = productsFromServer.map((product) => {
  const category = categoriesFromServer
    .find(catID => catID.id === product.categoryId) || null;
  const user = usersFromServer
    .find(users => users.id === category.ownerId) || null;

  return {
    ...product,
    category,
    user,
  };
});

export const App = () => {
  const [selectedUser, setSelectedUser] = useState('');
  const [query, setQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState([]);
  const [clickedSortedById, setIsSortedById] = useState(0);
  const [clickedSortedByProduct, setIsSortedByProduct] = useState(0);
  const [clickedSortedByCategory, setIsSortedByCategory] = useState(0);
  const [clickedSortedByUser, setIsSortedByUser] = useState(0);

  const handleAddCategory = (product) => {
    if (selectedCategory.includes(product)) {
      setSelectedCategory(prevCategory => prevCategory
        .filter(prod => prod !== product));
    } else {
      setSelectedCategory(prevCategory => [...prevCategory, product]);
    }
  };

  const filteredProduct = useMemo(() => {
    let newProduct = products;

    const trimmedQuery = query.trim()
      .split(' ')
      .filter(Boolean)
      .join(' ');

    if (trimmedQuery) {
      newProduct = newProduct.filter((product) => {
        const lowerQuery = trimmedQuery.toLowerCase();

        const names = product.name.toLowerCase();

        return names.includes(lowerQuery);
      });
    }

    if (selectedUser) {
      newProduct = newProduct
        .filter(product => product.user.name === selectedUser);
    }

    if (selectedCategory.length) {
      newProduct = newProduct
        .filter(product => selectedCategory.includes(product.category.title));
    }

    return newProduct;
  }, [selectedUser, selectedCategory, query]);

  const handleToggleSort = (type) => {
    setIsSortedById(0);
    setIsSortedByProduct(0);
    setIsSortedByCategory(0);
    setIsSortedByUser(0);

    switch (type) {
      case 'id':
        if (clickedSortedById === 1) {
          filteredProduct.sort((a, b) => b.id - a.id);
          setIsSortedById(clickedSortedById + 1);
        } else if (clickedSortedById === 0) {
          filteredProduct.sort((a, b) => a.id - b.id);
          setIsSortedById(clickedSortedById + 1);
        } else {
          handleToggleSort();
        }

        break;
      case 'product':

        if (clickedSortedByProduct === 1) {
          filteredProduct.sort((a, b) => b.name.localeCompare(a.name));
          setIsSortedByProduct(clickedSortedByProduct + 1);
        } else if (clickedSortedByProduct === 0) {
          filteredProduct.sort((a, b) => a.name.localeCompare(b.name));
          setIsSortedByProduct(clickedSortedByProduct + 1);
        } else {
          handleToggleSort();
        }

        break;
      case 'category':
        if (clickedSortedByCategory === 1) {
          filteredProduct.sort((a, b) => b.name.localeCompare(a.name));
          setIsSortedByCategory(clickedSortedByCategory + 1);
        } else if (clickedSortedByCategory === 0) {
          filteredProduct.sort((a, b) => a.name.localeCompare(b.name));
          setIsSortedByCategory(clickedSortedByCategory + 1);
        } else {
          handleToggleSort();
        }

        break;
      case 'user':
        if (clickedSortedByUser === 0) {
          filteredProduct.sort((a, b) => a.name.localeCompare(b.name));
          setIsSortedByUser(clickedSortedByUser + 1);
        } else if (clickedSortedByUser === 1) {
          filteredProduct.sort((a, b) => b.name.localeCompare(a.name));
          setIsSortedByUser(clickedSortedByUser + 1);
        } else {
          handleToggleSort();
        }

        break;

      default:
        filteredProduct.sort((a, b) => a.id - b.id);
    }
  };

  const handleReset = () => {
    setQuery('');
    setSelectedCategory([]);
    setSelectedUser('');
    if (!clickedSortedById) {
      handleToggleSort();
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
                onClick={() => setSelectedUser('')}
                className={!selectedUser && 'is-active'}
              >
                All
              </a>
              {usersFromServer
                .map(user => (
                  <a
                    data-cy="FilterUser"
                    href={`#/${user.name}`}
                    onClick={() => setSelectedUser(user.name)}
                    className={user.name === selectedUser && 'is-active'}
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
                  onChange={event => setQuery(event.target.value)}
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
                    />
                  </span>
                )}
              </p>
            </div>

            <div className="panel-block is-flex-wrap-wrap">
              <a
                href="#/"
                data-cy="AllCategories"
                className={!selectedCategory.length
                  ? 'button is-success mr-6'
                  : 'button is-success mr-6 is-outlined'}
                onClick={() => setSelectedCategory([])}
              >
                All
              </a>

              {categoriesFromServer.map(product => (
                <a
                  data-cy="Category"
                  className={selectedCategory.includes(product.title)
                    ? 'button mr-2 my-1 is-info'
                    : 'button mr-2 my-1'}
                  href={`#/${product.title}`}
                  onClick={() => handleAddCategory(product.title)}
                >
                  {' '}
                  {product.title}
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
        {filteredProduct.length
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

                      <a
                        href="#/"
                        onClick={() => handleToggleSort('id')}
                      >
                        <span className="icon">
                          <i
                            data-cy="SortIcon"
                            className={cn({
                              'fas fa-sort-up': clickedSortedById === 1,
                              'fas fa-sort-down': clickedSortedById === 2,
                              'fas fa-sort': clickedSortedById === 0,
                            })}

                          />
                        </span>
                      </a>
                    </span>
                  </th>

                  <th>
                    <span className="is-flex is-flex-wrap-nowrap">
                      Product

                      <a
                        href="#/"
                        onClick={() => handleToggleSort('product')}
                      >
                        <span className="icon">
                          <i
                            data-cy="SortIcon"
                            className={cn({
                              'fas fa-sort-up': clickedSortedByProduct === 1,
                              'fas fa-sort-down': clickedSortedByProduct === 2,
                              'fas fa-sort': clickedSortedByProduct === 0,
                            })}
                          />
                        </span>
                      </a>
                    </span>
                  </th>

                  <th>
                    <span className="is-flex is-flex-wrap-nowrap">
                      Category

                      <a href="#/" onClick={() => handleToggleSort('category')}>
                        <span className="icon">
                          <i
                            data-cy="SortIcon"
                            className={cn({
                              'fas fa-sort-up': clickedSortedByCategory === 1,
                              'fas fa-sort-down': clickedSortedByCategory === 2,
                              'fas fa-sort': clickedSortedByCategory === 0,
                            })}
                          />
                        </span>
                      </a>
                    </span>
                  </th>

                  <th>
                    <span className="is-flex is-flex-wrap-nowrap">
                      User

                      <a href="#/" onClick={() => handleToggleSort('user')}>
                        <span
                          className="icon"
                        >
                          <i
                            data-cy="SortIcon"
                            className={cn({
                              'fas fa-sort-up': clickedSortedByUser === 1,
                              'fas fa-sort-down': clickedSortedByUser === 2,
                              'fas fa-sort': clickedSortedByUser === 0,
                            })}
                          />
                        </span>
                      </a>
                    </span>
                  </th>
                </tr>
              </thead>

              <tbody>

                {filteredProduct.map(product => (
                  <tr data-cy="Product">
                    <td className="has-text-weight-bold" data-cy="ProductId">
                      {product.id}
                    </td>

                    <td data-cy="ProductName">{product.name}</td>
                    <td data-cy="ProductCategory">
                      {product.category.icon}
                      {' '}
                      -
                      {' '}
                      {product.category.title}
                    </td>

                    <td
                      data-cy="ProductUser"
                      className={
                      product.user.sex === 'm'
                        ? 'has-text-link'
                        : 'has-text-danger'
                    }
                    >
                      {product.user.name}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )
          : (
            <div className="box table-container">
              <p data-cy="NoMatchingMessage">
                No products matching selected criteria
              </p>
            </div>
          )}

      </div>
    </div>
  );
};
