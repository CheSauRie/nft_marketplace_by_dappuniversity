import { useState } from "react";
import { Pagination } from "react-bootstrap"
import { Card } from "react-bootstrap"
import { Button } from "react-bootstrap"
import { Col, Row } from "react-bootstrap"
import { Link } from "react-router-dom";


export default function Products() {

    const [productsData, setProductsData] = useState([]);

    const fecthProductsData = () => {

        var requestOptions = {
            method: 'GET',
            redirect: 'follow',
        };

        fetch("http://localhost:3001/product", requestOptions)
            .then(response => response.text())
            .then(result => {
                setProductsData(JSON.parse(result));
                console.log(productsData);
            }).catch(error => console.log('error', error));

    }

    fecthProductsData();
    console.log(productsData);


    return (
        <div>
            <h1>This is Products page</h1>
            <Row xs={2} md={3} xl={4} className="g-4 row">
                {
                    productsData.map((item, index) => (
                        <Col key={index}>
                            <Card style={{ width: '18rem', height: '20rem', alignItems: 'center' }}>
                                <Card.Img className="card-img" variant="top" src={item.images_list[0]} />
                                <Card.Body>
                                    <Card.Title as='h6'>{item.title}</Card.Title>
                                    <Card.Text>{item.price}</Card.Text>
                                    <Button variant="dark"><Link to={`/products/${item.title}`}>Purchase</Link></Button>
                                </Card.Body>
                            </Card>
                        </Col>
                    ))
                }
            </Row>

            <Pagination>
                <Pagination.First />
                <Pagination.Prev />
                <Pagination.Item>{1}</Pagination.Item>
                <Pagination.Ellipsis />

                <Pagination.Item>{10}</Pagination.Item>
                <Pagination.Item>{11}</Pagination.Item>
                <Pagination.Item active>{12}</Pagination.Item>
                <Pagination.Item>{13}</Pagination.Item>
                <Pagination.Item disabled>{14}</Pagination.Item>

                <Pagination.Ellipsis />
                <Pagination.Item>{20}</Pagination.Item>
                <Pagination.Next />
                <Pagination.Last />
            </Pagination>
        </div>
    )
}