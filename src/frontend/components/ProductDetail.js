import React, { useState, useRef } from "react"
import { useParams, useSearchParams } from "react-router-dom"
import { Button, Row, Form } from "react-bootstrap";
import { Canvas, useThree } from '@react-three/fiber';
import { Model } from './Af1';
import { Suspense } from 'react';
import { OrbitControls, Environment, ContactShadows } from '@react-three/drei';

import { useControls, button, folder } from 'leva';




export default function ProductDetail({ account, cart, setCart, setCartCount, productDetail }) {

    const [capturedImage, setCapturedImage] = useState(null);

    const addToCart = (item) => {
        setCart(prev => [...prev, item])
        setCartCount(prev => prev + 1);
    }

    const { productName } = useParams();
    const [renderModel, setRenderModel] = useState(false);
    const [renderForm, setRenderForm] = useState(false);

    //Shoes parts color customer customization variables
    const [lacesColor, setLacesColor] = useState('#FFFFFF');
    const [flapsColor, setflapsColor] = useState('#000');
    const [solesColor, setSolesColor] = useState('#FFFFFF');
    const [mainColor, setMainColor] = useState('#FFFFFF');
    const [tagsColor, setTagsColor] = useState('#FFFFFF');

    //Images list index;
    const [index, setIndex] = useState(0);
    const [size, setSize] = useState(7);

    const [selectedImage, setSelectedImage] = useState("");

    const [itemInfo, setItemInfo] = React.useState({
        title: '',
        price: ''
    })

    const convertToBase64 = (e) => {
        console.log(e);
        var reader = new FileReader();
        reader.readAsDataURL(e.target.files[0]);
        reader.onload = () => {
            console.log(reader.result);
            setSelectedImage(reader.result);
        };
        reader.onerror = error => {
            console.log("Error: ", error);
        };
    }

    console.log(selectedImage);

    const addWorkshopItem = () => {
        var raw = JSON.stringify({
            "title": itemInfo.title,
            "price": itemInfo.price + '$',
            "img": selectedImage,
            "author": account,
        })
        fetch("http://localhost:3001/create-item", {
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

    const Scene = () => {
        const gl = useThree((state) => state.gl)
        useControls({
            screenshot: button(() => {
                const link = document.createElement('a')
                link.setAttribute('download', 'canvas.png')
                link.setAttribute('href', gl.domElement.toDataURL('image/png').replace('image/png', 'image/octet-stream'))
                link.click()
            })
        })
        return (
            <>
                <ambientLight intensity={0.7} />
                <spotLight intensity={0.5} angle={0.1} penumbra={1} position={[10, 15, -5]} castShadow />
                <Environment preset="city" background blur={1} />
                <ContactShadows resolution={512} position={[0, -0.8, 0]} opacity={1} scale={10} blur={2} far={0.8} />
                <Model
                    customColors={{
                        laces: lacesColor,
                        flaps: flapsColor,
                        soles: solesColor,
                        main: mainColor,
                        tag: tagsColor
                    }} />
                <OrbitControls enablePan={true} enableZoom={true} enableRotate={true} />
            </>
        )
    }

    const sizeArray = [7, 7.5, 8, 8.5, 9, 9.5, 10, 10.5, 11];

    const item = {
        title: productName,
        brand: productDetail.brand,
        price: productDetail.price,
        images_list: productDetail.images_list,
        features: {
            "laces": lacesColor,
            "soles": solesColor,
            "flaps": flapsColor,
            "main": mainColor,
            "tags": tagsColor
        }
    };


    return (
        <div className="product-container">
            <div>
                <div className="main-img">
                    <img src={productDetail.images_list[index]}></img>
                </div>
            </div>
            <div className="product-detail">
                <h2>{productName}</h2>
                <h3>{productDetail.brand}</h3>
                <h3>{productDetail.price}</h3>
                <div className="btn-group">
                    <Button variant="dark" onClick={() => addToCart(item)}>Add to cart</Button>
                    <Button variant="dark" onClick={() => { setRenderModel(true) }}>Customize with our 3D model</Button>
                    <Button variant="dark" onClick={() => { setRenderForm(true) }}>Create item</Button>
                </div>
                <div className="img-list">
                    <div className="img-item" style={{ border: index === 0 ? '1px solid #000' : 'none' }} onClick={() => { setIndex(0) }}>
                        <img src={productDetail.images_list[0]}></img>
                    </div>
                    <div className="img-item" style={{ border: index === 1 ? '1px solid #000' : 'none' }} onClick={() => { setIndex(1) }}>
                        <img src={productDetail.images_list[1]}></img>
                    </div>
                    <div className="img-item" style={{ border: index === 2 ? '1px solid #000' : 'none' }} onClick={() => { setIndex(2) }}>
                        <img src={productDetail.images_list[2]}></img>
                    </div>
                    <div className="img-item" style={{ border: index === 3 ? '1px solid #000' : 'none' }} onClick={() => { setIndex(3) }}>
                        <img src={productDetail.images_list[3]}></img>
                    </div>
                    <div className="img-item" style={{ border: index === 4 ? '1px solid #000' : 'none' }} onClick={() => { setIndex(4) }}>
                        <img src={productDetail.images_list[4]}></img>
                    </div>
                    <div className="img-item" style={{ border: index === 5 ? '1px solid #000' : 'none' }} onClick={() => { setIndex(5) }}>
                        <img src={productDetail.images_list[5]}></img>
                    </div>
                    <div className="img-item" style={{ border: index === 6 ? '1px solid #000' : 'none' }} onClick={() => { setIndex(6) }}>
                        <img src={productDetail.images_list[6]}></img>
                    </div>
                </div>
                <h2>CHOOSE SIZE</h2>
                <div className="size-picker">
                    {
                        sizeArray.map((item) => (
                            <div style={{
                                width: 50, height: 50, border: size === item ? "3px solid #000" : "1px solid #000",
                                display: 'flex', alignItems: 'center', justifyContent: 'center'
                            }}
                                onClick={() => { setSize(item) }}
                            >
                                <p>{item}</p>
                            </div>
                        ))
                    }
                </div>
            </div>

            {
                renderModel && (
                    <div className="model-container">
                        <div className="header">
                            <h1>{productName} by you</h1>
                            <Button
                                style={{ position: 'fixed', right: 50, borderRadius: 20 }}
                                onClick={() => {
                                    setRenderModel(false);
                                }}
                                variant="dark">Done</Button>
                        </div>
                        <div id="model-canvas" style={{ display: 'flex', flexDirection: 'row', height: '70vh' }}>
                            <Canvas
                                gl={{ preserveDrawingBuffer: true }}
                                camera={{ position: [0, 0, 4], fov: 40, near: 0.1, far: 1000 }}
                                shadows={true}
                            >
                                <Suspense fallback={null}>
                                    <Scene />
                                </Suspense>
                            </Canvas>
                            <div className="color-picker">
                                <div className="row">
                                    <input type="color" id="laces" name="laces" value={lacesColor}
                                        onChange={(e) => setLacesColor(e.target.value)}></input>
                                    <label for="laces">Laces</label>
                                </div>
                                <div className="row">
                                    <input type="color" id="flaps" name="flaps" value={flapsColor}
                                        onChange={(e) => setflapsColor(e.target.value)}></input>
                                    <label for="flaps">Flaps</label>
                                </div>
                                <div className="row">
                                    <input type="color" id="soles" name="soles" value={solesColor}
                                        onChange={(e) => setSolesColor(e.target.value)}></input>
                                    <label for="soles">Sole</label>
                                </div>
                                <div className="row">
                                    <input type="color" id="main" name="main" value={mainColor}
                                        onChange={(e) => setMainColor(e.target.value)}></input>
                                    <label for="main">Main</label>
                                </div>
                                <div className="row">
                                    <input type="color" id="tags" name="tags" value={tagsColor}
                                        onChange={(e) => setTagsColor(e.target.value)}></input>
                                    <label for="tags">Tag</label>
                                </div>
                            </div>
                        </div>
                    </div>
                )
            }
            {
                renderForm && (
                    <div className="create-item-form">
                        <div className="container-fluid mt-5 create-nft">
                            <h1>Create your Workshop item</h1>
                            <div className="content mx-auto">
                                <Row className="g-4">
                                    <Form.Control onChange={(e) => setItemInfo({ ...itemInfo, title: e.target.value })} size="lg" required type="text" placeholder="Product's title" />
                                    <Form.Control onChange={(e) => setItemInfo({ ...itemInfo, price: e.target.value })} size="lg" required type="number" placeholder="Price" />
                                    <Form.Control onChange={convertToBase64} size="lg" required type="file" name="file" />
                                    <Button variant="primary" onClick={() => { addWorkshopItem() }}>Create</Button>
                                    <Button variant="light" onClick={() => { setRenderForm(false) }}>Close</Button>
                                </Row>
                            </div>
                        </div>
                    </div>
                )
            }
        </div>
    )
}