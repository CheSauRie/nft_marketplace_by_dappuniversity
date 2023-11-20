import React from "react"
import { useParams } from "react-router-dom"
import { Button } from "react-bootstrap";


export default function ProductDetail() {
    const { productName } = useParams();
    console.log(productName)

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
            }).
            catch(error => console.log('error', error));
    }

    return (
        <div className="product-container">
            <img src='https://th.bing.com/th/id/R.5371ed482428103757f36f11202383ad?rik=BK5Bt43q3oZrNw&riu=http%3a%2f%2fksassets.timeincuk.net%2fwp%2fuploads%2fsites%2f54%2f2016%2f12%2fmacbook-pro-13-2022-1.jpg&ehk=2EGvNZ1VpKKHBW9QZ%2faoJfy3tTXSDvY8F4hEuSbxx2I%3d&risl=&pid=ImgRaw&r=0'></img>
            <div className="product-detail">
                <h2>{productName}</h2>
                <Button variant="primary" onClick={loadProductDetail}>Test</Button>
            </div>
        </div>
    )
}