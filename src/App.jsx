import React, { useEffect, useState } from 'react';
import './App.scss';

import usersFromServer from './api/users';
import categoriesFromServer from './api/categories';
import productsFromServer from './api/products';

// const products = productsFromServer.map((product) => {
//   const category = null; // find by product.categoryId
//   const user = null; // find by category.ownerId

//   return null;
// });

const allProducts = productsFromServer.map(product => ({
  id: product.id,
  productName: product.name,
  categoryTitle: categoriesFromServer
    .filter(category => category.id === product.categoryId)[0].title,
  categoryIcon: categoriesFromServer
    .filter(category => category.id === product.categoryId)[0].icon,
  userName: usersFromServer
    .filter(user => user.id === categoriesFromServer
      .filter(cat => cat.id === product.categoryId)[0].ownerId)[0].name,
  userGender: usersFromServer
    .filter(user => user.id === categoriesFromServer
      .filter(cat => cat.id === product.categoryId)[0].ownerId)[0].sex,
}));

export const App = () => {
  const [query, setQuery] = useState();
  const [visibleProducts, setVisibleProducts] = useState(allProducts);
  const [userFilters, setUserFilters] = useState([]);
  const [categoryFilters, setCategoryFilters] = useState([]);
  // const [sorting, setSorting] = useState({
  //   by: '',
  //   direction: '',
  // });

  useEffect(() => {
    let filtered = allProducts;

    if (userFilters.length) {
      filtered = filtered
        .filter(product => userFilters.includes(product.userName));
    }

    if (categoryFilters.length) {
      filtered = filtered
        .filter(product => categoryFilters.includes(product.categoryTitle));
    }

    if (query) {
      filtered = filtered
        .filter(product => product.productName.toLocaleLowerCase()
          .includes(query.toLocaleLowerCase()));
    }

    setVisibleProducts(filtered);
  }, [userFilters, categoryFilters, query]);

  // const sort = (byWhat) => {
  //   if(byWhat==='ID'){
  //     setVisibleProducts(old=>old.sort((productA,productB)
  //       => productA[byWhat]-(productB[byWhat])));

  //   } else {
  //   setVisibleProducts(old=>old.sort((productA,productB)
  //     => productA[byWhat].localeCompare(productB[byWhat])));
  //   }
  // };

  const filterByUser = (userName) => {
    if (userFilters.includes(userName)) {
      setUserFilters(old => old.filter(name => name !== userName));
    } else {
      setUserFilters(old => [...old, userName]);
    }
  };

  const filterByCategory = (categoryTitle) => {
    if (categoryFilters.includes(categoryTitle)) {
      setCategoryFilters(old => old.filter(title => title !== categoryTitle));
    } else {
      setCategoryFilters(old => [...old, categoryTitle]);
    }
  };

  const resetFilters = () => {
    setCategoryFilters([]);
    setUserFilters([]);
    setQuery('');
  };

  const filterResults = (value) => {
    setQuery(value);
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
                className={`${userFilters.length === 0 ? 'is-active' : ''}`}
                data-cy="FilterAllUsers"
                href="#/"
                onClick={() => setUserFilters([])}
              >
                All
              </a>

              {usersFromServer.map(user => (
                <a
                  key={user.id}
                  data-cy="FilterUser"
                  className={`${userFilters.includes(user.name) ? 'is-active' : ''}`}
                  href="#/"
                  onClick={() => {
                    filterByUser(user.name);
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
                  value={query}
                  onChange={event => filterResults(event.target.value)}
                />

                <span className="icon is-left">
                  <i className="fas fa-search" aria-hidden="true" />
                </span>

                <span className="icon is-right">
                  {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
                  {query && (
                  <button
                    data-cy="ClearButton"
                    type="button"
                    className="delete"
                    onClick={() => setQuery('')}
                  />
                  )}
                </span>
              </p>
            </div>

            <div className="panel-block is-flex-wrap-wrap">
              <a
                href="#/"
                data-cy="AllCategories"
                className={`button is-success mr-6 ${categoryFilters.length ? 'is-outlined' : ''}`}
                onClick={() => setCategoryFilters([])}
              >
                All
              </a>

              {categoriesFromServer.map(category => (
                <a
                  key={category.id}
                  data-cy="Category"
                  className={`button mr-2 my-1 ${categoryFilters.includes(category.title)
                    ? 'is-info'
                    : ''}`}
                  href="#/"
                  onClick={() => filterByCategory(category.title)}
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
          {visibleProducts.length
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
                            <i
                              data-cy="SortIcon"
                              className="fas fa-sort"
                             // onClick={()=>sort('id')}
                            />
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
                  {visibleProducts.map(product => (
                    <tr data-cy="Product" key={product.id}>
                      <td className="has-text-weight-bold" data-cy="ProductId">
                        {product.id}
                      </td>

                      <td data-cy="ProductName">{product.productName}</td>
                      <td data-cy="ProductCategory">
                        {product.categoryIcon}
                        {' '}
                        -
                        {' '}
                        {product.categoryTitle}
                      </td>

                      <td
                        data-cy="ProductUser"
                        className={`${product.userGender === 'm' ? 'has-text-link' : 'has-text-danger'}`}
                      >
                        {product.userName}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )
            : (
              <p data-cy="NoMatchingMessage">
                No products matching selected criteria
              </p>
            )
          }

        </div>
      </div>
    </div>
  );
};
