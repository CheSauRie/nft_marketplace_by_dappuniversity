import React, { useState } from "react"
import './cart.css'
export default function Cart({ cart, setCart }) {

    const deleteItem = (id) => {

        setCart(prev => prev.filter(item => item.id !== id))

    }
    return (
        <div className="cart">

            <table className="cart-table">
                <thead>
                    <tr>
                        <th>Ảnh</th>
                        <th>Tên sản phẩm</th>
                        <th>Giá</th>
                        <th>Xóa</th>
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
                            <td><button onClick={() => deleteItem(item.id)}>Xóa</button></td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <button className="checkout-btn">Thanh toán</button>
        </div>
    )
}