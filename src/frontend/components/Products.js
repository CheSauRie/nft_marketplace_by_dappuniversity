import { useState } from "react";
import { Pagination } from "react-bootstrap"
import { Card } from "react-bootstrap"
import { Button } from "react-bootstrap"
import { Col, Row } from "react-bootstrap"
import { Link } from "react-router-dom";


export default function Products({ cart, setCart, setCartCount }) {

    const [productsData, setProductsData] = useState([]);
    const maxTitleLength = 50;
    // App.js
    const fecthProductsData = () => {

        var requestOptions = {
            method: 'GET',
            redirect: 'follow',
        };

        fetch("http://localhost:3001/product", requestOptions)
            .then(response => response.text())
            .then(result => {
                console.log(result);
                setProductsData(JSON.parse(result));
                console.log(productsData);
            }).catch(error => console.log('error', error));

    }

    //fecthProductsData();
    console.log(productsData);

    const addToCart = (item) => {
        setCart(prev => [...prev, item])
        setCartCount(prev => prev + 1);
    }

    return (
        <div>
            <h1>PRODUCTS</h1>
            <Button onClick={fecthProductsData}>Test</Button>
            <Row xs={2} md={3} xl={4} className="g-4 row">
                {
                    productsData.map((item, index) => (
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