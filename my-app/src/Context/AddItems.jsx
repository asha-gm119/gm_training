import React from 'react';
import { useCart } from './CartContext';

const products = [
  { id: 1, name: 'Apple', price: 0.99 },
  { id: 2, name: 'Banana', price: 0.59 },
  { id: 3, name: 'Orange', price: 0.79 },
];

export default function AddItem() {
  const { addItem } = useCart();

  return (
    <div>
      <h2>Products</h2>
      {products.map(product => (
        <div key={product.id} style={{ marginBottom: '8px' }}>
          <span>{product.name} - ${product.price.toFixed(2)}</span>
          <button
            style={{ marginLeft: '12px' }}
            onClick={() => addItem(product)}
          >
            Add to Cart
          </button>
        </div>
      ))}
    </div>
  );
}
