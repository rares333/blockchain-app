import React, { useEffect, useState } from "react";
import { getProvider, getMyNFTs, getEthBalance } from "../contractUtils";
import { motion, AnimatePresence } from "framer-motion";

export default function Inventory({ user, search, setSearch }) {
  const [address, setAddress] = useState(null);
  const [cars, setCars] = useState([]);
  const [houses, setHouses] = useState([]);
  const [balance, setBalance] = useState("0");
  const [modalNft, setModalNft] = useState(null);

  useEffect(() => {
    async function fetchData() {
      const provider = await getProvider();
      const signer = provider.getSigner();
      const userAddress = await signer.getAddress();
      setAddress(userAddress);
      const nfts = await getMyNFTs(userAddress);
      setCars(nfts.filter(nft => nft.itemType === "car"));
      setHouses(nfts.filter(nft => nft.itemType === "house"));
      if (
        userAddress &&
        typeof userAddress === "string" &&
        userAddress.startsWith("0x") &&
        userAddress.length === 42
      ) {
        setBalance(await getEthBalance(userAddress));
      }
    }
    fetchData();
  }, [user]);

  const s = (search || "").trim().toLowerCase();
  const filteredHouses = !s
    ? houses
    : houses.filter(
        nft =>
          nft.name.toLowerCase().includes(s) ||
          (nft.addr && nft.addr.toLowerCase().includes(s))
      );
  const filteredCars = !s
    ? cars
    : cars.filter(
        nft =>
          nft.name.toLowerCase().includes(s) ||
          (nft.vin && nft.vin.toLowerCase().includes(s))
      );

  // Helper for car/house icon
  const getTypeIcon = (type) => type === "car" ? "🚗" : "🏠";

  // Framer Motion variants for animation
  const overlayVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
    exit: { opacity: 0 }
  };
  const modalVariants = {
    hidden: { y: 60, opacity: 0, scale: 0.95 },
    visible: { y: 0, opacity: 1, scale: 1, transition: { type: "spring", stiffness: 360, damping: 26 } },
    exit: { y: 60, opacity: 0, scale: 0.95 }
  };

  return (
    <div className="inventory-bg">
      <div className="inventory-content">
        <h1 className="inventory-title">Your Properties</h1>
        <div className="inventory-desc">
          View your owned houses and cars below. Use the Transfer tab to send an item.
        </div>
        <div>
          <div className="section-title">Houses</div>
          <div className="card-grid">
            {filteredHouses.length === 0 && <span className="inventory-empty">No houses found.</span>}
            {filteredHouses.map((nft) => (
              <div
                key={nft.tokenId}
                className="asset-card"
                onClick={() => setModalNft(nft)}
                style={{ cursor: "pointer" }}
              >
                <div className="asset-type">🏠</div>
                <div className="asset-title name-animate">{nft.name}</div>
                <div className="asset-detail">
                  Worth: <span className="asset-money">${nft.value?.toLocaleString?.() ?? nft.value}</span>
                </div>
                <div className="asset-detail">Purchased: {nft.purchaseDate}</div>
                <div className="asset-detail">Address: {nft.addr}</div>
                <div className="asset-id">NFT ID: {nft.tokenId}</div>
              </div>
            ))}
          </div>
        </div>
        <div className="section-title" style={{ marginTop: 32 }}>Cars</div>
        <div className="card-grid">
          {filteredCars.length === 0 && <span className="inventory-empty">No cars found.</span>}
          {filteredCars.map((nft) => (
            <div
              key={nft.tokenId}
              className="asset-card"
              onClick={() => setModalNft(nft)}
              style={{ cursor: "pointer" }}
            >
              <div className="asset-type">🚗</div>
              <div className="asset-title name-animate">{nft.name}</div>
              <div className="asset-detail">
                Worth: <span className="asset-money">${nft.value?.toLocaleString?.() ?? nft.value}</span>
              </div>
              <div className="asset-detail">Purchased: {nft.purchaseDate}</div>
              <div className="asset-detail">VIN: {nft.vin}</div>
              <div className="asset-id">NFT ID: {nft.tokenId}</div>
            </div>
          ))}
        </div>
      </div>

      {/* --- MODAL POPUP with framer-motion --- */}
      <AnimatePresence>
        {modalNft && (
          <motion.div
            className="modal-blur"
            variants={overlayVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={() => setModalNft(null)}
            style={{ zIndex: 1002 }}
          >
            <motion.div
              className="modal-popup"
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              onClick={e => e.stopPropagation()}
              layout
            >
              <button className="modal-close" onClick={() => setModalNft(null)}>
                ×
              </button>
              <motion.div
                className="modal-icon"
                initial={{ scale: 0.7, rotate: -7, opacity: 0 }}
                animate={{ scale: 1, rotate: 0, opacity: 1, transition: { type: "spring", duration: 0.45 } }}
                exit={{ scale: 0.8, opacity: 0 }}
              >
                {getTypeIcon(modalNft.itemType)}
              </motion.div>
              <motion.div
                className="modal-title"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0, transition: { delay: 0.1 } }}
                exit={{ opacity: 0, y: 10 }}
              >
                {modalNft.name}
              </motion.div>
              <motion.div
                className="modal-info"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0, transition: { delay: 0.16 } }}
                exit={{ opacity: 0, y: 10 }}
              >
                <div>
                  <b>Type:</b> {modalNft.itemType === "car" ? "Car" : "House"}
                </div>
                <div>
                  <b>Worth:</b>{" "}
                  <span style={{ color: "#226cf6", fontWeight: 700 }}>${modalNft.value?.toLocaleString?.() ?? modalNft.value}</span>
                </div>
                <div>
                  <b>Purchase Date:</b> {modalNft.purchaseDate}
                </div>
                {modalNft.itemType === "car" && (
                  <div><b>VIN:</b> {modalNft.vin}</div>
                )}
                {modalNft.itemType === "house" && (
                  <div><b>Address:</b> {modalNft.addr}</div>
                )}
                <div><b>NFT ID:</b> {modalNft.tokenId}</div>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* --- STYLES (your existing CSS) --- */}
      <style>{`
        .inventory-bg {
          min-height: 100vh;
          background: linear-gradient(110deg, #f6fafd 0%, #f4f6fb 90%);
          padding-bottom: 60px;
          font-family: 'Inter', system-ui, sans-serif;
        }
        .inventory-content {
          max-width: 1120px;
          margin: 0 auto;
          margin-top: 38px;
          padding: 0 18px 0 18px;
        }
        .inventory-title {
          font-size: 2.25rem;
          font-weight: 900;
          color: #20212a;
          margin-bottom: 8px;
          letter-spacing: 0.01em;
        }
        .inventory-desc {
          margin-bottom: 28px;
          color: #555c6e;
          font-size: 1.14rem;
          font-weight: 400;
        }
        .section-title {
          font-size: 1.28rem;
          font-weight: 700;
          color: #1d2234;
          margin-bottom: 13px;
          letter-spacing: 0.01em;
        }
        .card-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(255px, 1fr));
          gap: 30px;
          margin-bottom: 36px;
        }
        .asset-card {
          background: #fff;
          border-radius: 18px;
          box-shadow: 0 3px 16px #e8eafd33, 0 1.5px 8px #c2c6e61b;
          padding: 23px 25px 18px 25px;
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          min-width: 220px;
          transition: box-shadow .14s, border .17s, transform .13s;
          border: 2px solid transparent;
          position: relative;
          overflow: hidden;
        }
        .asset-card:hover {
          border: 2px solid #262cff;
          box-shadow: 0 6px 22px #aab8ff44, 0 1.5px 8px #c2c6e629;
          transform: translateY(-3px) scale(1.017);
        }
        .asset-type {
          font-size: 2.2rem;
          margin-bottom: 8px;
        }
        .asset-title {
          font-size: 1.14rem;
          font-weight: 700;
          color: #181a23;
          margin-bottom: 6px;
          letter-spacing: 0.03em;
        }
        /* Animation effect for asset names */
        .name-animate {
          position: relative;
          display: inline-block;
          cursor: pointer;
          background: linear-gradient(90deg, #6366f1 40%, #0091ff 80%, #181a23 120%);
          background-size: 200% 100%;
          background-clip: text;
          -webkit-background-clip: text;
          color: transparent;
          -webkit-text-fill-color: transparent;
          transition: background-position 0.38s cubic-bezier(0.4,0.2,0.2,1);
        }
        .asset-card:hover .name-animate {
          background-position: -100% 0;
          color: #262cff;
          -webkit-text-fill-color: #262cff;
        }
        .asset-detail {
          color: #596081;
          font-size: 1.03rem;
          margin-bottom: 2.5px;
        }
        .asset-money {
          color: #262cff;
          font-weight: 700;
          letter-spacing: 0.01em;
        }
        .asset-id {
          font-size: 0.97rem;
          color: #b0b2c3;
          margin-top: 6px;
          letter-spacing: 0.02em;
        }
        .inventory-empty {
          color: #bbbfd0;
          font-size: 1.04rem;
          font-weight: 500;
          padding: 15px 0 0 7px;
        }
        /* MODAL POPUP STYLES */
        .modal-blur {
          position: fixed;
          top: 0; left: 0; width: 100vw; height: 100vh;
          z-index: 1002;
          background: rgba(38,44,80,0.15);
          backdrop-filter: blur(3.5px);
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .modal-popup {
          background: #fff;
          border-radius: 19px;
          box-shadow: 0 18px 50px #262cff1c, 0 2px 18px #262cff15;
          padding: 42px 35px 28px 35px;
          min-width: 340px;
          max-width: 94vw;
          min-height: 230px;
          display: flex;
          flex-direction: column;
          align-items: center;
          position: relative;
        }
        .modal-close {
          position: absolute;
          right: 18px;
          top: 18px;
          background: none;
          border: none;
          font-size: 1.6rem;
          color: #c5c8d6;
          font-weight: 700;
          cursor: pointer;
          transition: color .18s;
        }
        .modal-close:hover { color: #262cff; }
        .modal-icon {
          font-size: 2.5rem;
          margin-bottom: 15px;
          text-shadow: 0 2px 10px #6366f122;
        }
        .modal-title {
          font-size: 1.38rem;
          font-weight: 800;
          color: #262cff;
          margin-bottom: 14px;
          text-align: center;
          letter-spacing: 0.03em;
        }
        .modal-info {
          color: #313651;
          font-size: 1.12rem;
          display: flex;
          flex-direction: column;
          gap: 6px;
          width: 100%;
        }
        @media (max-width: 600px) {
          .modal-popup { padding: 24px 8vw 22px 8vw; }
        }
      `}</style>
    </div>
  );
}
