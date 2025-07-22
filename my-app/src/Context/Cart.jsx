import React from 'react';
import { useCart } from './CartContext';

export default function Cart() {
  const { cartItems, removeItem } = useCart();

  if (cartItems.length === 0) return <p>Cart is empty.</p>;

  return (
    <div>
      <h2>Your Cart</h2>
      <ul>
        {cartItems.map(({ id, name, price, quantity }) => (
          <li key={id} style={{ marginBottom: '10px' }}>
            {name} - ${price.toFixed(2)} x {quantity}
            <button
              style={{ marginLeft: '10px' }}
              onClick={() => removeItem(id)}
            >
              Remove
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
