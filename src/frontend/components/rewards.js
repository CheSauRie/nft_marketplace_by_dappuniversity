import { useState, useEffect } from 'react'
import { ethers } from "ethers"
import { Row, Col, Card, Table } from 'react-bootstrap'
export default function Rewards({ marketplace, nft }) {
  const [loading, setLoading] = useState(true)
  const [listedItems, setListedItems] = useState([])
  const loadListedItems = async () => {
    // Load all sold items that the user listed
    const itemCount = await marketplace.itemCount()
    let listedItems = []
    let soldItems = []
    for (let indx = 1; indx <= itemCount; indx++) {
      const i = await marketplace.items(indx)
      if (i.owner.toLowerCase() === '0x90f79bf6eb2c4f870365e785982e1f101e93b906') {
        // get uri url from nft contract
        const uri = await nft.tokenURI(i.tokenId)
        // use uri to fetch the nft metadata stored on ipfs 
        const response = await fetch(uri)
        const metadata = await response.json()
        // get total price of item (item price + fee)
        const totalPrice = await marketplace.getTotalPrice(i.itemId)
        // define listed item object
        let item = {
          totalPrice,
          price: i.price,
          itemId: i.itemId,
          name: metadata.name,
          description: metadata.description,
          image: metadata.image
        }
        listedItems.push(item)
        // Add listed item to sold items array if sold
        if (i.sold) soldItems.push(item)
      }
    }
      setLoading(false)
      setListedItems(listedItems)
    }

    const getNFT = async (item) => {
      await (await marketplace.claimFromFixedAccount(item.itemId)).wait()
      loadListedItems()
    }
    
    useEffect(() => {
      loadListedItems()
    }, [])
    if (loading) return (
      <main style={{ padding: "1rem 0" }}>
        <h2>Loading...</h2>
      </main>
    )
    return (
    <div className="flex justify-center listed-items">
        {listedItems.length > 0 ?
        <div className="px-5 container">
            <h2>Rewards List</h2>
            <Table striped bordered hover>
            <thead>
                <tr>
                <th>Image</th>
                <th>Name</th>
                <th>Description</th>
                <th>Price (ETH)</th>
                <th>Accquire</th>
                </tr>
            </thead>
            <tbody>
                {listedItems.map((item, idx) => (
                <tr key={idx}>
                    <td><img src={item.image} alt={item.name} style={{ width: '50px', height: '50px' }} /></td>
                    <td>{item.name}</td>
                    <td>{item.description}</td>
                    <td>{ethers.utils.formatEther(item.totalPrice)}</td>
                    <td><button onClick={() => getNFT(item)}>Get</button></td>
                </tr>
                ))}
            </tbody>
            </Table>
        </div>
        : (
            <main style={{ padding: "1rem 0" }}>
            <h2>No listed assets</h2>
            </main>
        )}
    </div>
      
    );
  }