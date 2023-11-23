import React, { useState } from "react"
import './cart.css'
import { errors, ethers } from 'ethers';
import { Row, Form, Button } from "react-bootstrap";
export default function Cart({ account, cart, setCart, setCartCount }) {

    const [customer, setCustomer] = useState(false);
    const [customerInfo, setCustomerInfo] = React.useState({
        customerId: account,
        customerName: '',
        address: '',
    })

    const checkCustomer = () => {
        var requestOptions = {
            method: 'GET',
            redirect: 'follow'
        };

        fetch(`http://localhost:3001/auth/${account}`, requestOptions)
            .then(response => response.json())
            .then(result => {
                if (result.message === true) {
                    setCustomer(true);
                }
            }).
            catch(error => console.log('error', error));
    }

    checkCustomer();

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
                customer ? (
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
                        <button className="checkout-btn" onClick={purchase}>Purchase</button>
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
                                        setCustomer(true);
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