import React from "react";
import { ListGroup, Card, CardGroup } from 'react-bootstrap';
import quan from "./quan.jpg"
import minh from "./minh.jpg"
import nam from "./nam.jpg"
import video from "./test.mp4"
import image from './img_bg.avif';
import shoe from './shoes.jpg'
import metamask from './MetaMask_Fox.svg.png'
import nft from './nft.jpg'
import chatbot from "./chatbotesds.jpg"
import { Link } from "react-router-dom";
import "./Landingpage.css"
function LandingPage() {
    const members = [
        {
            id: '20020211',
            img: './quan.jpg',
            email: 'Trịnh Hồng Quân'
        },
        {
            id: '2002443',
            img: 'https://randomuser.me/api/portraits/women/1.jpg',
            email: 'Hoàng Gia Minh'
        },
        {
            id: '20020445',
            img: 'https://randomuser.me/api/portraits/men/2.jpg',
            email: 'Chu Minh Nam'
        }
    ]
    return (
        <div>
            <div className="welcome">
                <h2 className="feature-main" >WEB 3.0 - ECOMMERCE</h2>
            </div>
            {/* <Carousel>
                <Carousel.Item>
                    <Image src={market} className="img"></Image>
                    <Carousel.Caption>
                        <h3 className="title">First slide label</h3>
                        <p className="content">Nulla vitae elit libero, a pharetra augue mollis interdum.</p>
                    </Carousel.Caption>
                </Carousel.Item>
                <Carousel.Item>
                    <Image src={market} className="img"></Image>
                    <Carousel.Caption>
                        <h3 className="title">Second slide label</h3>
                        <p className="content">Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
                    </Carousel.Caption>
                </Carousel.Item>
                <Carousel.Item>
                    <Image src={market} className="img"></Image>
                    <Carousel.Caption>
                        <h3 className="title">Third slide label</h3>
                        <p className="content">
                            Praesent commodo cursus magna, vel scelerisque nisl consectetur.
                        </p>
                    </Carousel.Caption>
                </Carousel.Item>
            </Carousel> */}

            <div className="video-content">
                <video className='video' src={video} width="750" height="500" controls autoPlay
                    loop
                    playsInline
                    muted>
                </video>
                <Link to="/create">
                    <button className="button-directional">Tạo NFT</button>
                </Link>
            </div>
            <div>
                <picture>
                    <source srcset={image} type="image/avif" />
                    <img src={image.replace('.avif', '.jpg')} />
                    <div>
                        <Link to="/products">
                            <button className="button-directional-2" >Xem Sản Phẩm</button>
                        </Link>
                    </div>
                </picture>
            </div>

            {/* <ListGroup className="feature-list">
                <h2 className="feature-main">Các chức năng chính</h2>
                <ListGroup.Item>
                    <span className="bullet">&#8226;</span>
                    Mua hàng bằng tiền ảo thông qua ví metamask
                </ListGroup.Item>
                <ListGroup.Item>
                    <span className="bullet">&#8226;</span>
                    Sáng tạo sản phẩm của riêng nình từ mô hình 3D
                </ListGroup.Item>
                <ListGroup.Item>
                    <span className="bullet">&#8226;</span>
                    Chatbot AI hỗ trợ người dùng
                </ListGroup.Item>
                <ListGroup.Item>
                    <span className="bullet">&#8226;</span>
                    Tạo, mua bán và trao đổi NFTs
                </ListGroup.Item>
            </ListGroup> */}


            <h2 className="feature-main" >Các chức năng chính</h2>
            <CardGroup className="member-grid-2">
                <Card>
                    <Card.Img variant="top" src={metamask} />
                </Card>
                <Card>
                    <Card.Img variant="top" src={shoe} />

                </Card>
                <Card>
                    <Card.Img variant="top" src={nft} />

                </Card>
                <Card>
                    <Card.Img variant="top" src={chatbot} />

                </Card>
            </CardGroup>

            <h2 className="feature-main" >Thành viên</h2>
            <CardGroup className="member-grid">
                <Card>
                    <Card.Img variant="top" src={quan} />
                    <div>
                        <p className="member-detail">20020211</p>
                        <p className="member-detail">Trịnh Hồng Quân</p>
                    </div>
                </Card>
                <Card>
                    <Card.Img variant="top" src={minh} />
                    <div>
                        <p className="member-detail">20020443</p>
                        <p className="member-detail">Hoàng Gia Minh</p>
                    </div>
                </Card>
                <Card>
                    <Card.Img variant="top" src={nam} />
                    <div>
                        <p className="member-detail">20020445</p>
                        <p className="member-detail">Chu Minh Nam</p>
                    </div>
                </Card>
            </CardGroup>
            <footer>

                <div className="footer-content">

                    <div className="footer-info">
                        <h3>Công ty TNHH Quân Đoàn 301</h3>
                        <p>Địa chỉ: 144 Xuân Thủy, Cầu Giấy, Hà Nội</p>

                        <div className="social-icons">
                            <i className="fab fa-facebook"></i>
                            <i className="fab fa-instagram"></i>
                            <i className="fab fa-twitter"></i>
                        </div>
                    </div>


                </div>

                <div className="footer-bottom">
                    <p>2023 Shoes Shop - All rights reserved</p>
                </div>

            </footer>
        </div>
    )
}

export default LandingPage