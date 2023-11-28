import { useState, useEffect } from 'react'
import { ethers } from "ethers"
import { Row, Col, Card, Table } from 'react-bootstrap'
export default function Rewards({ marketplace, nft, account }) {
  const [loading, setLoading] = useState(true)
  const [listedItems, setListedItems] = useState([])
  let totalSpent = 0;

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
      fetch(`http://localhost:3001/total-spent/${account}`)
        .then(response => response.json())
        .then(data => {
          totalSpent = data[0].totalPrice;
          console.log(totalSpent);
        })
        .catch(error => console.error('Error:', error));

      const price = ethers.utils.formatEther(item.totalPrice)

      console.log(price);
      console.log(totalSpent);
      if (price > totalSpent / 100) {
        alert('The price of this NFT is more than 1/100 of your total spent. Please choose another NFT. Spend more money!');
        return;
      }
      await (await marketplace.claimFromFixedAccount(item.itemId)).wait();
      loadListedItems();
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
            <h2>No Rewards</h2>
            </main>
        )}
    </div>
      
    );
  }