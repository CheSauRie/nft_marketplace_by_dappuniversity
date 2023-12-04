import { Card } from "react-bootstrap"
import { Button } from "react-bootstrap"
import { Col, Row } from "react-bootstrap"

export default function Workshop({ cart, setCart, setCartCount, workshopData }) {

    const maxTitleLength = 50;

    const addToCart = (item) => {
        setCart(prev => [...prev, item])
        setCartCount(prev => prev + 1);
    }


    return (
        <div>
            <Row xs={2} md={3} xl={4} className="g-4 row">
                {
                    workshopData.map((item, index) => (
                        <Col key={index}>
                            <Card style={{ width: '18rem', height: '20rem', alignItems: 'center' }}>
                                <Card.Img className="card-img" variant="top" src={item.images_list[0]} />
                                <Card.Body>
                                    <Card.Title as='h6'>{item.title.substring(0, maxTitleLength)}</Card.Title>
                                    <Card.Text>{item.price}</Card.Text>
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