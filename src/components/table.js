import React, { useState } from 'react';

export const Table = ({ products }) => {
  const defualtSort = {
    type: '',
    mouseClicks: 0,
  };

  const [sort, setSort] = useState({ ...defualtSort });
  const sortedProducts = [...products];
  const tableHeaders = ['ID', 'Product', 'Category', 'User'];

  const pickSortingType = (type) => {
    if (sort.type !== type) {
      setSort({ type, mouseClicks: 1 });
    } else {
      setSort({ ...sort, mouseClicks: sort.mouseClicks + 1 });
    }
  };

  if (sort.mouseClicks > 2) {
    setSort({ ...defualtSort });
  }

  const order = sort.mouseClicks === 1 ? 1 : -1;

  switch (sort.type) {
    case 'ID':
    {
      sortedProducts.sort((firstProduct, secondProduct) => (
        order * (firstProduct.id - secondProduct.id)));
      break;
    }

    case 'Product':
      sortedProducts.sort((firstProduct, secondProduct) => {
        const firstProductName = firstProduct.name;
        const secondProductName = secondProduct.name;

        if (order === 1) {
          return firstProductName.localeCompare(secondProductName);
        }

        return secondProductName.localeCompare(firstProductName);
      });
      break;
    case 'Category':
      sortedProducts.sort((firstProduct, secondProduct) => {
        const firstProductCategory = firstProduct.category.title;
        const secondProductCategory = secondProduct.category.title;

        if (order === 1) {
          return firstProductCategory.localeCompare(secondProductCategory);
        }

        return secondProductCategory.localeCompare(firstProductCategory);
      });
      break;
    case 'User': {
      sortedProducts.sort((firstProduct, secondProduct) => {
        const firstProductUserName = firstProduct.user.name;
        const secondProductUserName = secondProduct.user.name;

        if (order === 1) {
          return firstProductUserName.localeCompare(secondProductUserName);
        }

        return secondProductUserName.localeCompare(firstProductUserName);
      });
      break;
    }

    default:
      break;
  }

  const orderClassName = order === -1 ? 'fa-sort-down' : 'fa-sort-up';

  return (
    <table
      data-cy="ProductTable"
      className="table is-striped is-narrow is-fullwidth"
    >
      <thead>
        <tr>
          {tableHeaders.map(header => (
            <th>
              <span className="is-flex is-flex-wrap-nowrap">
                {header}

                <a href="#/" onClick={() => pickSortingType(header)}>
                  <span className="icon">
                    <i
                      data-cy="SortIcon"
                      className={`fas ${sort.type === header ? orderClassName : 'fa-sort'}`}
                    />
                  </span>
                </a>
              </span>
            </th>
          ))}
        </tr>
      </thead>

      <tbody>
        {sortedProducts.map(product => (
          <tr data-cy="Product">
            <td className="has-text-weight-bold" data-cy="ProductId">
              {product.id}
            </td>

            <td data-cy="ProductName">{product.name}</td>
            <td data-cy="ProductCategory">{`${product.category.icon} - ${product.category.title}`}</td>

            <td
              data-cy="ProductUser"
              className={`${product.user.sex === 'm' ? 'has-text-link' : 'has-text-danger'}`}
            >
              {product.user.name}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};
