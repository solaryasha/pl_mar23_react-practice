import React from 'react';

export function Product({ id, productName, category, user }) {
  return (
    <tr data-cy="Product">
      <td className="has-text-weight-bold" data-cy="ProductId">
        {id}
      </td>

      <td data-cy="ProductName">{productName}</td>
      <td data-cy="ProductCategory">
        <span>{`${category.icon} `}</span>
        -
        {` ${category.title}`}
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
}
