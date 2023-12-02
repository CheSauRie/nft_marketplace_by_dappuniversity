import { useState, useEffect } from 'react'
import { ethers } from "ethers"
import { Row, Col, Card, Button } from 'react-bootstrap'

export default function MyPurchases({ marketplace, nft, account }) {
  const [loading, setLoading] = useState(true)
  const [purchases, setPurchases] = useState([])
  const [boughtItems, setBoughtItems] = useState([])
  const loadNFTItems = async () => {
    // Fetch purchased items from marketplace by quering Offered events with the buyer set as the user
    const filter = marketplace.filters.Bought(null, null, null, null, null, account)
    const results = await marketplace.queryFilter(filter)
    //Fetch metadata of each nft and add that to listedItem object.
    const purchases = await Promise.all(results.map(async i => {
      // fetch arguments from each result
      i = i.args
      // get uri url from nft contract
      const uri = await nft.tokenURI(i.tokenId)
      // use uri to fetch the nft metadata stored on ipfs 
      const response = await fetch(uri)
      const metadata = await response.json()
      // get total price of item (item price + fee)
      const totalPrice = await marketplace.getTotalPrice(i.itemId)
      const sold = await marketplace.isSold(i.itemId)
      const tokenId = await marketplace.getTokenId(i.itemId)
      // define listed item object
      let purchasedItem = {
        totalPrice,
        price: i.price,
        itemId: i.itemId,
        name: metadata.name,
        description: metadata.description,
        image: metadata.image,
        sold: sold,
        tokenId: tokenId
      }
      return purchasedItem
      
      }))
    setLoading(false)
    setPurchases(purchases)
  }

  const loadPurchasedItems = () => {
    var requestOptions = {
      method: 'GET',
      redirect: 'follow'
    };

    fetch(`http://localhost:3001/purchase/${account}`, requestOptions)
      .then(response => response.json())
      .then(result => {
        let tempArr = [];
        for (let obj of result) {
          for (let object of obj.items) {
            tempArr.push(object);
          }
        }
        setBoughtItems(tempArr);
        console.log(tempArr);
        console.log(boughtItems);
      })
      .catch(error => console.log('error', error));
  }

  const reSell = async (item) => {
    let nftContract;
    let marketplaceContract;
    let nftAddress;
    let marketplaceAddress;

    // Fetch the contract address
    await fetch('http://localhost:3001/contractsData/NFT.json')
      .then(response => {
        console.log("Status code:", response.status);
        return response.json();
      })
      .then(data => {
        nftContract = data.abi;
        console.log(nftContract);
      })
      .catch(error => console.error(error));


      await fetch('http://localhost:3001/contractsData/NFT-address.json')
      .then(response => {
        console.log("Status code:", response.status);
        return response.json();
      })
      .then(data => {
        nftAddress = data.address;
        console.log(nftAddress);
      })
      .catch(error => console.error(error));

      await fetch('http://localhost:3001/contractsData/Marketplace-address.json')
      .then(response => {
        console.log("Status code:", response.status);
        return response.json();
      })
      .then(data => {
        marketplaceAddress = data.address;
        console.log(marketplaceAddress);
      })
      .catch(error => console.error(error));

    // Fetch the contract ABI
    await fetch('http://localhost:3001/contractsData/Marketplace.json')
      .then(response => {
        console.log("Status code:", response.status);
        return response.json();
      })
      .then(data => {
        marketplaceContract = data.abi;
        console.log(marketplaceContract);
      });
      
    // Now you can use contractAddress and contractABI to interact with your contract
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const tokenId = item.tokenId; // The ID of the token you want to approve for transfer
    const nftContractInstance = new ethers.Contract(nftAddress, nftContract, signer);
    const tx = await nftContractInstance.setApprovalForAll(marketplaceAddress, true);
    await tx.wait();
    // Approve the marketplace contract to transfer the token on behalf of the owner
    let priceInEther = ethers.utils.formatEther(item.totalPrice);
    await (await marketplace.reSell(item.itemId, ethers.utils.parseEther(priceInEther))).wait();
    loadNFTItems();
  }

  useEffect(() => {
    loadNFTItems();
    loadPurchasedItems();
  }, [])
  if (loading) return (
    <main style={{ padding: "1rem 0" }}>
      <h2>Loading...</h2>
    </main>
  )

  return (
    <div className="flex justify-center">
      {purchases.length > 0 ?
        <div className="px-5 container">
          <h2 style={{margin: 20}}> NFTs </h2>
          <Row xs={1} md={2} lg={4} className="g-4 py-5">
            {purchases.map((item, idx) => (
              !item.sold ? null :
              <Col key={idx} className="overflow-hidden">
                <Card>
                  <Card.Img variant="top" src={item.image} />
                  <Card.Footer>
                    <div className='d-grid'>
                      <Button onClick={() => reSell(item)} variant="primary" size="lg">
                        Sell with {ethers.utils.formatEther(item.totalPrice)} ETH
                      </Button>
                    </div>
                  </Card.Footer>
                </Card>
              </Col>
            ))}
          </Row>
          <h2>Other products</h2>
          <Row xs={1} md={2} lg={4} className="g-4 py-5">
            {boughtItems.map((item, idx) => (
              <Col key={idx} className="overflow-hidden">
                <Card>
                  <Card.Img style={{minHeight: 300, height: 'inherit'}} variant="top" src={item.images_list[0]} />
                  <Card.Footer>{item.price} USD</Card.Footer>
                </Card>
              </Col>
            ))}
          </Row>
        </div>
        : (
          <main style={{ padding: "1rem 0" }}>
            <h2>No purchases</h2>
          </main>
        )}
    </div>
  );
}