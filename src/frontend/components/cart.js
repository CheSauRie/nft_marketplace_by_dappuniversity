import React, { useState } from "react"
import './cart.css'
import { errors, ethers } from 'ethers';
import { Row, Form, Button } from "react-bootstrap";
export default function Cart({ account, auth, cart, setCart, setCartCount }) {
    const [customerInfo, setCustomerInfo] = React.useState({
        customerId: account,
        customerName: '',
        address: '',
    })
    const authCustomer = () => {
        var raw = JSON.stringify({
            "customerId": customerInfo.customerId,
            "customerName": customerInfo.customerName,
            "address": customerInfo.address,
        })
        if (customerInfo.customerId == '' || customerInfo.customerName == '' || customerInfo.address == '') {
            alert('Missing required infomation')
        } else {
            fetch("http://localhost:3001/create-customer", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: raw,
                redirect: 'follow'
            }).then(res => res.json()).then(
                result => {
                    alert(result);
                }
            ).catch(error => console.log('error', error));
        }
    }
    async function purchase() {   
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        const userAddress = accounts[0]; 
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const totalPrice = cart.reduce((total, item) => total + parseFloat(item.price.replace(/[^\d.-]/g, '')), 0);
        const totalPriceInWei = ethers.utils.parseEther(totalPrice.toString());
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
            {
                auth ? (
                    <div>
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
                        <button className="checkout-btn" onClick={purchase} disabled={cart.length === 0}>Purchase</button>
                    </div>
                ) : (
                    <div>
                        <h1>We need some information to bring goods to you</h1>
                        <div className="content mx-auto">
                            <Row className="g-4">
                                <Form.Control onChange={(e) => setCustomerInfo({ ...customerInfo, customerName: e.target.value })} size="lg" required type="text" placeholder="How we can call you ?" />
                                <Form.Control onChange={(e) => setCustomerInfo({ ...customerInfo, address: e.target.value })} size="lg" required type="text" placeholder="Your Address" />
                                <Form.Control size="lg" type="text" placeholder="Your Email" />
                                <Form.Control size="lg" type="number" placeholder="Just nothing" />
                                <div className="d-grid px-0">
                                    <Button onClick={() => {
                                        authCustomer();
                                    }} variant="primary" size="lg">
                                        Submit and Go to Cart
                                    </Button>
                                </div>
                            </Row>
                        </div>
                    </div>
                )
            }
        </div>
    )
}