import React, { useState } from "react"
import './cart.css'
import { ethers } from 'ethers';
export default function Cart({ cart, setCart, setCartCount }) {

    

    async function purchase() {
        // Request account access
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });

        // Create a signer object
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();

        // Calculate total price of cart items
        const totalPrice = cart.reduce((total, item) => total + parseFloat(item.price.replace(/[^\d.-]/g, '')), 0);

        // Convert total price to wei (1 ether = 10^18 wei)
        const totalPriceInWei = ethers.utils.parseEther(totalPrice.toString());

        // Send transaction
        const tx = await signer.sendTransaction({
            to: '0x70997970C51812dc3A010C7d01b50e0d17dc79C8', // Replace with the merchant's address
            value: totalPriceInWei,
        });

        console.log(`Transaction sent with hash: ${tx.hash}`);
    }
      
    
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
            <button className="checkout-btn" onClick={purchase}>Purchase</button>
        </div>
        
    )
}