import React, { useState } from "react"
import './cart.css'
import { ethers } from 'ethers';
export default function Cart({ cart, setCart, setCartCount }) {

    

    async function purchase() {
        
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        const userAddress = accounts[0]; 
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();     
        const totalPrice = cart.reduce((total, item) => total + parseFloat(item.price.replace(/[^\d.-]/g, '')), 0);
        const totalPriceInWei = ethers.utils.parseEther(totalPrice.toString());
    
        // Send transaction
        const tx = await signer.sendTransaction({
            to: '0x70997970C51812dc3A010C7d01b50e0d17dc79C8',
            value: totalPriceInWei,
        });
    
        console.log(`Transaction sent with hash: ${tx.hash}`);
        const receipt = await provider.waitForTransaction(tx.hash);

        const paymentData = {
            buyer: userAddress,
            seller: '0x70997970C51812dc3A010C7d01b50e0d17dc79C8',
            status: receipt.status === 1 ? 'success' : 'failure',
            totalPrice: totalPrice,
            items: cart,
        };
    
        const response = await fetch('http://localhost:3001/save-payment', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(paymentData),
        });

        console.log(response.status)
        
        if (receipt.status === 1) {
            alert('Thanh toán thành công!');
            setCart([]);
            setCartCount(0);
        } else {
            alert('thanh toán thất bại!');
        }
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