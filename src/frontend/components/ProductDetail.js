import React, { useState } from "react"
import { useParams, useSearchParams } from "react-router-dom"
import { Button } from "react-bootstrap";


export default function ProductDetail() {
    const { productName } = useParams();

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
                console.log(result.product.title);
                setProductDetail({
                    ...productDetail,
                    brand: result.product.brand,
                    price: result.product.price,
                    images_list: result.product.images_list
                });
            }).
            catch(error => console.log('error', error));
    }

    console.log(productDetail);
    loadProductDetail();

    return (
        <div className="product-container">
            <div>
                <img src={productDetail.images_list[0]}></img>
                <div className="img-list">
                    <img src={productDetail.images_list[0]}></img>
                    <img src={productDetail.images_list[1]}></img>
                    <img src={productDetail.images_list[2]}></img>
                    <img src={productDetail.images_list[3]}></img>
                    <img src={productDetail.images_list[4]}></img>
                    <img src={productDetail.images_list[5]}></img>
                    <img src={productDetail.images_list[6]}></img>
                </div>
            </div>
            <div className="product-detail">
                <h2>{productName}</h2>
                <h3>{productDetail.brand}</h3>
                <h3>{productDetail.price}</h3>
                <Button variant="dark">Add to cart</Button>
            </div>
        </div>
    )
}