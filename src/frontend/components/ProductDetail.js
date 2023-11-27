import React, { useState } from "react"
import { useParams, useSearchParams } from "react-router-dom"
import { Button } from "react-bootstrap";
import { Canvas } from '@react-three/fiber';
import { Model } from './Af1';
import { Suspense } from 'react';
import { OrbitControls } from '@react-three/drei';
import { set } from "mongoose";


export default function ProductDetail() {
    const { productName } = useParams();
    const [renderModel, setRenderModel] = useState(false);

    //Shoes parts color customer customization variables
    const [lacesColor, setLacesColor] = useState('#FFFFFF');
    const [flapsColor, setflapsColor] = useState('#000');
    const [solesColor, setSolesColor] = useState('#FFFFFF');
    const [mainColor, setMainColor] = useState('#FFFFFF');
    const [tagsColor, setTagsColor] = useState('#FFFFFF');

    //Images list index;
    const [index, setIndex] = useState(0);

    const [productDetail, setProductDetail] = useState({
        price: "",
        brand: "",
        images_list: "",
    });

    const loadProductDetail = () => {
        var requestOptions = {
            method: 'GET',
            redirect: 'follow'
        };

        fetch(`http://localhost:3001/product/${productName}`, requestOptions)
            .then(response => response.json())
            .then(result => {
                console.log('Load product detail successfull');
                console.log(result);
                setProductDetail({
                    ...productDetail,
                    brand: result[0].brand,
                    price: result[0].price,
                    images_list: result[0].images_list
                });
            }).
            catch(error => console.log('error', error));
    }

    console.log(productDetail);
    loadProductDetail();

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
                <Button variant="dark">Add to cart</Button>
                <Button variant="dark" onClick={() => { setRenderModel(true) }}>Customize with our 3D model</Button>
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
            </div>
            {
                renderModel && (
                    <div className="model-container">
                        <Button variant="dark" onClick={() => { setRenderModel(false) }}>Close</Button>
                        <Canvas>
                            <Suspense fallback={null}>
                                <ambientLight intensity={1.0} />
                                <spotLight intensity={0.9} angle={1.0} penumbra={1}
                                    position={[10, 15, 10]} castShadow />
                                <Model customColors={{
                                    laces: lacesColor,
                                    flaps: flapsColor,
                                    soles: solesColor,
                                    main: mainColor,
                                    tag: tagsColor
                                }} />
                                <OrbitControls enablePan={true} enableZoom={true} enableRotate={true} />
                            </Suspense>
                        </Canvas>
                        <div className="color-picker">
                            <div>
                                <input type="color" id="laces" name="laces" value={lacesColor}
                                    onChange={(e) => setLacesColor(e.target.value)}></input>
                                <label for="laces">Laces</label>
                                <input type="color" id="flaps" name="flaps" value={flapsColor}
                                    onChange={(e) => setflapsColor(e.target.value)}></input>
                                <label for="flaps">Flaps</label>
                                <input type="color" id="soles" name="soles" value={solesColor}
                                    onChange={(e) => setSolesColor(e.target.value)}></input>
                                <label for="soles">Sole</label>
                                <input type="color" id="main" name="main" value={mainColor}
                                    onChange={(e) => setMainColor(e.target.value)}></input>
                                <label for="main">Main</label>
                                <input type="color" id="tags" name="tags" value={tagsColor}
                                    onChange={(e) => setTagsColor(e.target.value)}></input>
                                <label for="tags">Tag</label>
                            </div>
                        </div>
                    </div>
                )
            }
        </div>
    )
}