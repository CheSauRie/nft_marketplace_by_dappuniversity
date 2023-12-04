import {
  BrowserRouter,
  Routes,
  Route
} from "react-router-dom";
import Navigation from './Navbar';
import Home from './Home.js'
import Create from './Create.js'
import MyListedItems from './MyListedItems.js'
import MyPurchases from './MyPurchases.js'
import Cart from "./cart.js";
import Products from "./Products.js";
import LandingPage from "./Landingpage.js"
import Rewards from "./rewards.js";
import MarketplaceAbi from '../contractsData/Marketplace.json'
import MarketplaceAddress from '../contractsData/Marketplace-address.json'
import NFTAbi from '../contractsData/NFT.json'
import NFTAddress from '../contractsData/NFT-address.json'
import { useState } from 'react'
import { ethers } from "ethers"
import { Spinner } from 'react-bootstrap'
import { useEffect } from "react";

import './App.css';
import ProductDetail from "./ProductDetail.js";
import Workshop from "./Workshop.js";
import { fetchJson } from "ethers/lib/utils.js";

function App() {
  const [loading, setLoading] = useState(true)
  const [account, setAccount] = useState(null)
  const [auth, setAuth] = useState(false)
  const [nft, setNFT] = useState({})
  const [marketplace, setMarketplace] = useState({})
  const [cart, setCart] = useState([]);
  const [cartCount, setCartCount] = useState(0);
  const [productsData, setProductsData] = useState([]);
  const [workshopData, setWorkshopData] = useState([]);
  const [productDetail, setProductDetail] = useState({
    price: "",
    brand: "",
    images_list: "",
});

  // MetaMask Login/Connect
  const web3Handler = async () => {
    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
    setAccount(accounts[0])
    // Get provider from Metamask
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    // Set signer
    const signer = provider.getSigner()

    window.ethereum.on('chainChanged', (chainId) => {
      window.location.reload();
    })

    window.ethereum.on('accountsChanged', async function (accounts) {
      setAccount(accounts[0])
      await web3Handler()
    })
    loadContracts(signer)
  }

  const fetchProductsData = () => {

    var requestOptions = {
      method: 'GET',
      redirect: 'follow',
    };

    fetch(`http://localhost:3001/product/${null}`, requestOptions)
      .then(response => response.text())
      .then(result => {
        console.log('executed');
        console.log(result);
        setProductsData(JSON.parse(result));
        console.log(productsData);
      }).catch(error => console.log('error', error));

  }

  const fetchWorkshopData = () => {
    var requestOptions = {
      method: 'GET',
      redirect: 'follow',
    };

    fetch(`http://localhost:3001/workshop-item`, requestOptions)
      .then(response => response.text())
      .then(result => {
        console.log('executed');
        console.log(result);
        setWorkshopData(JSON.parse(result));
        console.log(workshopData);
      }).catch(error => console.log('error', error));
  }

  const loadProductDetail = (productName) => {
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

  const checkCustomer = () => {
    var requestOptions = {
      method: 'GET',
      redirect: 'follow'
    };

    fetch(`http://localhost:3001/auth/${account}`, requestOptions)
      .then(response => response.json())
      .then(result => {
        if (result.message === true) {
          setAuth(true);
        }
      }).
      catch(error => console.log('error', error));
  }

  const loadContracts = async (signer) => {
    // Get deployed copies of contracts
    const marketplace = new ethers.Contract(MarketplaceAddress.address, MarketplaceAbi.abi, signer)
    setMarketplace(marketplace)
    const nft = new ethers.Contract(NFTAddress.address, NFTAbi.abi, signer)
    setNFT(nft)
    setLoading(false)
  }

  checkCustomer();

  return (
    <BrowserRouter>
      <div className="App">
        <>
          <Navigation web3Handler={web3Handler} account={account} cartCount={cartCount}
            setCartCount={setCartCount} fetchProductsData={fetchProductsData} fetchWorkshopData={fetchWorkshopData} />
        </>
        <div>
          {loading ? (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
              <Spinner animation="border" style={{ display: 'flex' }} />
              <p className='mx-3 my-0'>Awaiting Metamask Connection...</p>
            </div>
          ) : (
            <Routes>
              <Route path="/" element={
                <Home marketplace={marketplace} nft={nft} />
              } />
              <Route path="/create" element={
                <Create marketplace={marketplace} nft={nft} />
              } />
              <Route path="/landing-page" element={
                <LandingPage />
              } />
              <Route path="/my-listed-items" element={
                <MyListedItems marketplace={marketplace} nft={nft} account={account} />
              } />
              <Route path="/my-purchases" element={
                <MyPurchases marketplace={marketplace} nft={nft} account={account} />
              } />
              <Route path="/products" element={
                <Products cart={cart}
                  setCart={setCart} setCartCount={setCartCount} productsData={productsData} setProductsData={setProductsData}
                  loadProductDetail={loadProductDetail} />
              } />
              <Route path="/cart" element={
                <Cart account={account} auth={auth} cart={cart} setCart={setCart} setCartCount={setCartCount} />
              } />
              <Route path="/rewards" element={
                <Rewards marketplace={marketplace} nft={nft} account={account} />
              } />
              <Route path="/products/:productName" element={
                <ProductDetail account={account} cart={cart} setCart={setCart} setCartCount={setCartCount} productDetail={productDetail} />
              } />
              <Route path="/workshop" element={
                <Workshop cart={cart} setCart={setCart} setCartCount={setCartCount} workshopData={workshopData} />
              } />
            </Routes>
          )}
        </div>
      </div>
    </BrowserRouter>

  );
}

export default App;
