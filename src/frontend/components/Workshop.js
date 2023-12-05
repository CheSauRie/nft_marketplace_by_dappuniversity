import { Card } from "react-bootstrap"
import { Button } from "react-bootstrap"
import { Col, Row } from "react-bootstrap"

import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function Workshop({ cart, setCart, setCartCount, workshopData }) {

    const maxTitleLength = 50;

    const addToCart = (item) => {
        setCart(prev => [...prev, item])
        setCartCount(prev => prev + 1);
    }


    return (
        <div className="products">
            <div className="header">
                <h1>WORKSHOP</h1>
                <div className="search-bar">
                    <form>
                        <input type="text" placeholder="Type something" ></input>
                        <FontAwesomeIcon icon={faSearch} />
                    </form>
                </div>  
            </div>
            <Row xs={2} md={3} xl={4} className="g-4 row">
                {
                    workshopData.map((item, index) => (
                        <Col key={index}>
                            <Card style={{ width: '18rem', height: '20rem', alignItems: 'center' }}>
                                <Card.Img className="card-img" variant="top" src={item.image} />
                                <Card.Body>
                                    <Card.Title style={{textAlign: 'start'}} as='h6'>{item.title.substring(0, maxTitleLength)}</Card.Title>
                                    <Card.Text style={{color: '#00AC4F', fontWeight: 'bold', textAlign: 'start'}}>{item.price}</Card.Text>
                                    <Button onClick={() => addToCart(item)}>Add to Cart</Button>
                                </Card.Body>
                            </Card>
                        </Col>
                    ))
                }
            </Row>
        </div>
    )
}