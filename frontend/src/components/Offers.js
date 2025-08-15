import React, { useEffect, useState } from "react";
import { getProvider, getPendingOffers, acceptOffer, getMyNFTs } from "../contractUtils";

export default function Offers({ user }) {
  const [address, setAddress] = useState(null);
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [nfts, setNfts] = useState([]);
  const [ethUsd, setEthUsd] = useState(null);

  useEffect(() => {
    async function fetchData() {
      const provider = await getProvider();
      const signer = provider.getSigner();
      const userAddress = await signer.getAddress();
      setAddress(userAddress);
      setOffers(await getPendingOffers(userAddress));
      setNfts(await getMyNFTs(userAddress));
    }
    fetchData();
  }, [user]);

  // Fetch ETH-USD exchange rate
  useEffect(() => {
    async function fetchEthUsd() {
      try {
        const res = await fetch(
          "https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd"
        );
        const data = await res.json();
        setEthUsd(data.ethereum.usd);
      } catch {
        setEthUsd(null);
      }
    }
    fetchEthUsd();
  }, []);

  function getNftDetails(tokenId) {
    return nfts.find((nft) => nft.tokenId === tokenId);
  }

  async function handleAcceptOffer(offer) {
    try {
      setLoading(true);
      await acceptOffer(offer.offerId, offer.price);
      setMessage(`Offer accepted! You paid ${offer.price} ETH and received the item.`);
      setOffers(await getPendingOffers(address));
      setNfts(await getMyNFTs(address));
    } catch (err) {
      setMessage("Error accepting offer: " + err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="offers-bg">
      <div className="offers-container">
        <h1 className="offers-title">Your Offers</h1>
        <div className="offers-desc">
          Below are all offers sent to you. Accept and pay to receive the asset!
        </div>
        <div className="offers-list-box">
          <div className="offers-list-hint">
            If someone offered you an asset for ETH, you'll see it here.
          </div>
          {offers.length === 0 && (
            <span className="offers-empty">No pending offers.</span>
          )}
          {offers.map((offer) => {
            const nft = getNftDetails(offer.tokenId) || {};
            const isCar = nft.itemType === "car";
            return (
              <div key={offer.offerId} className="offers-card">
                <div style={{ display: "flex", alignItems: "flex-start", gap: 17 }}>
                  <div style={{ fontSize: 32, marginRight: 7 }}>
                    {isCar ? "🚗" : "🏠"}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div className="offers-card-title animated-title">
                      {nft.name ? nft.name : `Offer for NFT #${offer.tokenId}`}
                    </div>
                    <div className="offers-card-detail">
                      {isCar && nft.vin && (
                        <div>VIN: <span style={{ color: "#23283b", fontWeight: 500 }}>{nft.vin}</span></div>
                      )}
                      {!isCar && nft.addr && (
                        <div>Address: <span style={{ color: "#23283b", fontWeight: 500 }}>{nft.addr}</span></div>
                      )}
                      <div style={{ color: "#b0b2c3", fontSize: 13 }}>
                        NFT ID: {offer.tokenId}
                      </div>
                    </div>
                  </div>
                </div>
                <div style={{ marginTop: 6, marginBottom: 8 }}>
                  <span style={{ color: "#b68908", fontWeight: 600 }}>Price: </span>
                  <span style={{ color: "#fbbf24", fontWeight: 800 }}>
                    {offer.price} ETH
                  </span>
                  {ethUsd && (
                    <span style={{ color: "#226cf6", fontWeight: 700, marginLeft: 12 }}>
                      (${(parseFloat(offer.price) * ethUsd).toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })} USD)
                    </span>
                  )}
                </div>
                <div style={{ fontSize: 13 }}>
                  From:{" "}
                  <span style={{ color: "#555" }}>
                    {offer.seller.slice(0, 8)}...{offer.seller.slice(-4)}
                  </span>
                </div>
                <button
                  className="offers-btn"
                  onClick={() => handleAcceptOffer(offer)}
                  disabled={loading}
                >
                  Accept & Pay
                </button>
              </div>
            );
          })}
        </div>
        {message && (
          <div
            className={
              "offers-message" +
              (message.startsWith("Error") ? " error" : "")
            }
          >
            {message}
          </div>
        )}
      </div>
            {/* ...main JSX content... */}
            <style>{`
        .offers-bg {
          min-height: 100vh;
          background: #f6f8fc;
          padding-bottom: 60px;
          font-family: 'Inter', system-ui, sans-serif;
        }
        .offers-container {
          max-width: 1100px;
          margin: 44px auto 0 auto;
          padding: 0 18px;
        }
        .offers-title {
          font-size: 2.2rem;
          font-weight: 900;
          margin-bottom: 9px;
          color: #23283b;
          letter-spacing: 0.01em;
        }
        .offers-desc {
          margin-bottom: 32px;
          color: #5a6078;
          font-size: 1.17rem;
        }
        .offers-list-box {
          background: #fff;
          border-radius: 18px;
          box-shadow: 0 4px 18px #edeef3;
          padding: 18px 18px 15px 18px;
          min-height: 120px;
          margin-top: 5px;
        }
        .offers-list-hint {
          color: #777;
          font-size: 15px;
          margin-bottom: 10px;
        }
        .offers-empty {
          color: #5a6078;
          font-weight: 500;
        }
        .offers-card {
          background: #f9fafc;
          border-radius: 13px;
          padding: 16px 18px 13px 18px;
          margin-bottom: 14px;
          box-shadow: 0 2px 11px #edeef1;
          display: flex;
          flex-direction: column;
          gap: 5px;
        }
        .offers-card-title.animated-title {
          font-size: 1.13rem;
          font-weight: 700;
          margin-bottom: 3px;
          letter-spacing: 0.03em;
          animation: shimmer-casino 2.3s infinite linear;
          background: linear-gradient(90deg,#226cf6 0%,#226cf6 50%,#226cf6 100%);
          background-size: 200% 100%;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        @keyframes shimmer-casino {
          0% { background-position: 120% 0; }
          100% { background-position: -120% 0; }
        }
        .offers-card-detail {
          color: #69718a;
          font-size: 1.05rem;
          margin-bottom: 3px;
        }
        .offers-btn {
          background: linear-gradient(90deg,#226cf6,#226cf6 120%);
          color: #fff;
          border: none;
          font-weight: 700;
          padding: 9px 0;
          border-radius: 10px;
          font-size: 1.09rem;
          width: 100%;
          margin-top: 9px;
          box-shadow: 0 2px 7px #226cf615;
          cursor: pointer;
          transition: background .15s;
        }
        .offers-btn:disabled {
          opacity: 0.68;
          cursor: not-allowed;
        }
        .offers-btn:hover {
          background: linear-gradient(90deg,#111,#226cf6 140%);
          box-shadow: 0 4px 16px #226cf617;
        }
        .offers-message {
          margin-top: 28px;
          font-weight: 500;
          color: #2cb72c;
        }
        .offers-message.error {
          color: #e44;
        }
        @media (max-width: 750px) {
          .offers-container { padding: 0 2vw; }
        }
      `}</style>
    </div>
  );
}
