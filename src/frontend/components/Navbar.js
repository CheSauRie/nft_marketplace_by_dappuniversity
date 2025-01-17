import {
    Link
} from "react-router-dom";
import { Navbar, Nav, Button, Container } from 'react-bootstrap'
import market from './market.png'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import { faShoppingCart } from "@fortawesome/free-solid-svg-icons";

const Navigation = ({ web3Handler, account, cartCount, setCartCount, fetchProductsData, fetchWorkshopData }) => {

    return (
        <Navbar expand="lg" bg="secondary" variant="dark">
            <Container>
                <Navbar.Brand href="http://www.dappuniversity.com/bootcamp">
                    <img src={market} width="40" height="40" className="" alt="" />
                    &nbsp; BOAT E-commerce
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="responsive-navbar-nav" />
                <Navbar.Collapse id="responsive-navbar-nav">
                    <Nav className="me-auto">
                        <Nav.Link as={Link} to="/landing-page">Home</Nav.Link>
                        <Nav.Link as={Link} to="/">NFTs</Nav.Link>
                        <Nav.Link as={Link} to="/products" onClick={fetchProductsData}>Products</Nav.Link>
                        <Nav.Link as={Link} to="/workshop" onClick={fetchWorkshopData}> Workshop </Nav.Link>
                        <Nav.Link as={Link} to="/create">Create</Nav.Link>
                        <Nav.Link as={Link} to="/my-listed-items">My Listed Items</Nav.Link>
                        <Nav.Link as={Link} to="/my-purchases">My Purchases</Nav.Link>
                        <Nav.Link as={Link} to="/rewards">Rewards</Nav.Link>
                        <Nav.Link as={Link} to="/cart"> <FontAwesomeIcon icon={faShoppingCart} /> Cart <span className="badge">{cartCount}</span> </Nav.Link>
                    </Nav>
                    <Nav>
                        {account ? (
                            <Nav.Link
                                href={`https://etherscan.io/address/${account}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="button nav-button btn-sm mx-4">
                                <Button variant="outline-light">
                                    {account.slice(0, 5) + '...' + account.slice(38, 42)}
                                </Button>

                            </Nav.Link>
                        ) : (
                            <Button onClick={web3Handler} variant="outline-light">Connect Wallet</Button>
                        )}
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    )

}

export default Navigation;