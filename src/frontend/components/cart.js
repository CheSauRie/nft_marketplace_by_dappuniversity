import React, { useState } from "react"
import './cart.css'
export default function Cart({ cart, setCart, setCartCount }) {

    const deleteItem = (title) => {
        console.log(title);
        setCart(prev => prev.filter(item => item.title !== title))
        setCartCount(prevCount => prevCount - 1);
    }
    return (
        <div className="cart">

            <table className="cart-table">
                <thead>
                    <tr>
                        <th>Product</th>
                        <th>Name</th>
                        <th>Price</th>
                        <th>Delete</th>
                    </tr>
                </thead>

                <tbody>
                    {cart.map(item => (
                        <tr key={item.id}>
                            <td>
                                <img className="img" src={item.images_list[0]} alt="product" />
                            </td>
                            <td>{item.title}</td>
                            <td>{item.price}</td>
                            <td><button onClick={() => deleteItem(item.title)}>Delete</button></td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <button className="checkout-btn">Purchase</button>
        </div>
    )
}