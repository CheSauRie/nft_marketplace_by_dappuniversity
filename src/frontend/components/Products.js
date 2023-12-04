import { useState } from "react";
import { Pagination } from "react-bootstrap"
import { Card } from "react-bootstrap"
import { Button } from "react-bootstrap"
import { Col, Row } from "react-bootstrap"
import { Link } from "react-router-dom";

import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";


export default function Products({ cart, setCart, setCartCount, productsData, setProductsData, loadProductDetail }) {

    const [resultProducts, setResultProducts] = useState([]);
    const [searchTarget, setSearchTarget] = useState(null);
    const maxTitleLength = 50;
    // App.js
    const findProducts = () => {

        var requestOptions = {
            method: 'GET',
            redirect: 'follow',
        };

        fetch(`http://localhost:3001/product/${searchTarget}`, requestOptions)
            .then(response => response.text())
            .then(result => {
                console.log('Button Clicked')
                setResultProducts(JSON.parse(result));
                console.log(resultProducts);
            }).catch(error => console.log('error', error));

    }

    //fecthProductsData();
    console.log(resultProducts);
    console.log(productsData);

    const addToCart = (item) => {
        setCart(prev => [...prev, item])
        setCartCount(prev => prev + 1);
    }

    //fecthProductsData();

    return (
        <div className="products">
            <div className="header">
                <h1>PRODUCTS</h1>
                <div className="search-bar">
                    <form>
                        <input type="text" placeholder="Type something" onChange={(e) => setSearchTarget(e.target.value)}></input>
                        <FontAwesomeIcon icon={faSearch} onClick={() => { findProducts(); }} />
                    </form>

                </div>
            </div>
            {
                resultProducts.length === 0 ? (
                    <Row xs={2} md={3} xl={4} className="g-4 row">
                        {
                            productsData.map((item, index) => (
                                <Col key={index}>
                                    <Card style={{ width: '18rem', height: '20rem', alignItems: 'center' }}>
                                        <Card.Img className="card-img" variant="top" src={item.images_list[0]} />
                                        <Card.Body>
                                            <Card.Title as='h6' style={{textAlign: 'start'}}>{item.title.substring(0, maxTitleLength)}</Card.Title>
                                            <Card.Title as='h6' style={{textAlign: 'start'}}>{item.brand}</Card.Title>
                                            <Card.Text style={{color: '#00AC4F', fontWeight: 'bold', textAlign: 'start'}}>{item.price}</Card.Text>
                                            <Button variant="light" onClick={() => {
                                                loadProductDetail(item.title);
                                            }}><Link to={`/products/${item.title}`}>Purchase</Link></Button>
                                            <Button onClick={() => addToCart(item)}>Add to Cart</Button>
                                        </Card.Body>
                                    </Card>
                                </Col>
                            ))
                        }
                    </Row>
                ) : (
                    <Row xs={2} md={3} xl={4} className="g-4 row">
                        {
                            resultProducts.map((item, index) => (
                                <Col key={index}>
                                    <Card style={{ width: '18rem', height: '20rem', alignItems: 'center' }}>
                                        <Card.Img className="card-img" variant="top" src={item.images_list[0]} />
                                        <Card.Body>
                                            <Card.Title as='h6'>{item.title.substring(0, maxTitleLength)}</Card.Title>
                                            <Card.Text>{item.price}</Card.Text>
                                            <Button variant="light"><Link to={`/products/${item.title}`}>Purchase</Link></Button>
                                            <Button onClick={() => addToCart(item)}>Add to Cart</Button>
                                        </Card.Body>
                                    </Card>
                                </Col>
                            ))
                        }
                    </Row>
                )
            }

            <Pagination className="pagination">
                <Pagination.First />
                <Pagination.Prev />
                <Pagination.Item active>{1}</Pagination.Item>
                <Pagination.Ellipsis />

                <Pagination.Item>{10}</Pagination.Item>
                <Pagination.Item>{11}</Pagination.Item>
                <Pagination.Item >{12}</Pagination.Item>
                <Pagination.Item>{13}</Pagination.Item>
                <Pagination.Item>{14}</Pagination.Item>

                <Pagination.Ellipsis />
                <Pagination.Item>{20}</Pagination.Item>
                <Pagination.Next />
                <Pagination.Last />
            </Pagination>
        </div>
    )
}