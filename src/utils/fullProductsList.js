import usersFromServer from '../api/users';
import categoriesFromServer from '../api/categories';
import productsFromServer from '../api/products';

const getCategoryById = categoryId => (
  categoriesFromServer.find(category => category.id === categoryId)
);

const getUserById = userId => (
  usersFromServer.find(user => user.id === userId)
);

const products = productsFromServer.map((product) => {
  const category = getCategoryById(product.categoryId) || null;
  const user = getUserById(category.ownerId) || null;

  return {
    ...product,
    user,
    category,
  };
});

export default products;
