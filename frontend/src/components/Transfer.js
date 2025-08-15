
// import React, { useEffect, useState } from "react";
// import {
//   getProvider,
//   getMyNFTs,
//   createBatchOffers,
// } from "../contractUtils";

// export default function Transfer({ user }) {
//   const [address, setAddress] = useState(null);
//   const [nfts, setNfts] = useState([]);
//   const [selected, setSelected] = useState([]);
//   const [to, setTo] = useState("");
//   const [amount, setAmount] = useState("");
//   const [message, setMessage] = useState("");
//   const [loading, setLoading] = useState(false);

//   // NEW: State for ETH-USD price
//   const [ethUsd, setEthUsd] = useState(null);

//   // Fetch ETH price in USD when component mounts
//   useEffect(() => {
//     async function fetchEthPrice() {
//       try {
//         const res = await fetch(
//           "https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd"
//         );
//         const data = await res.json();
//         setEthUsd(data?.ethereum?.usd || null);
//       } catch {
//         setEthUsd(null);
//       }
//     }
//     fetchEthPrice();
//     // Optional: Refresh price every 2 min for accuracy
//     const interval = setInterval(fetchEthPrice, 120000);
//     return () => clearInterval(interval);
//   }, []);

//   useEffect(() => {
//     async function fetchData() {
//       const provider = await getProvider();
//       const signer = provider.getSigner();
//       const userAddress = await signer.getAddress();
//       setAddress(userAddress);
//       setNfts(await getMyNFTs(userAddress));
//     }
//     fetchData();
//   }, [user]);

//   function toggleSelected(tokenId) {
//     setSelected((prev) =>
//       prev.includes(tokenId)
//         ? prev.filter((id) => id !== tokenId)
//         : [...prev, tokenId]
//     );
//   }

//   async function handleCreateOffer(e) {
//     e.preventDefault();
//     if (!selected.length || !to || !amount) {
//       setMessage("Select one or more assets, recipient, and amount.");
//       return;
//     }
//     setMessage("");
//     setLoading(true);
//     try {
//       await createBatchOffers(selected, to, amount);
//       setMessage(
//         selected.length > 1
//           ? `Offers created for ${selected.length} items!`
//           : "Offer created!"
//       );
//       setTo("");
//       setAmount("");
//       setSelected([]);
//     } catch (err) {
//       setMessage("Error: " + (err?.message || err));
//     } finally {
//       setLoading(false);
//     }
//   }

//   // Calculate USD value for the entered ETH amount
//   const usdAmount =
//     ethUsd && amount && !isNaN(Number(amount))
//       ? (parseFloat(amount) * ethUsd).toLocaleString("en-US", {
//           style: "currency",
//           currency: "USD",
//           minimumFractionDigits: 2,
//           maximumFractionDigits: 2,
//         })
//       : null;

//   return (
//     <div className="transfer-bg">
//       <div className="transfer-container">
//         <h1 className="transfer-title">Send Trade Offer</h1>
//         <div className="transfer-desc">
//           Select <b>one or more assets</b>, enter recipient wallet, and set price (ETH) to create offers.<br />
//           Recipient must accept and pay for trade to complete!
//         </div>
//         <div className="transfer-card-list">
//           {nfts.map((nft) => (
//             <div
//               key={nft.tokenId}
//               className={
//                 "transfer-card" +
//                 (selected.includes(nft.tokenId) ? " selected" : "")
//               }
//               onClick={() => toggleSelected(nft.tokenId)}
//             >
//               <div className="card-type">
//                 {nft.itemType === "car" ? "🚗" : "🏠"}
//               </div>
//               <div className="card-title animated-title">{nft.name}</div>
//               <div className="card-detail">
//                 {nft.itemType === "car"
//                   ? `VIN: ${nft.vin}`
//                   : `Address: ${nft.addr}`}
//               </div>
//               <div className="card-id">NFT ID: {nft.tokenId}</div>
//               {selected.includes(nft.tokenId) && (
//                 <span className="card-selected-check">✓</span>
//               )}
//             </div>
//           ))}
//         </div>
//         <form onSubmit={handleCreateOffer} className="transfer-form">
//           <label htmlFor="to" className="transfer-label">
//             Recipient Wallet Address
//           </label>
//           <input
//             id="to"
//             className="transfer-input"
//             type="text"
//             placeholder="0x..."
//             value={to}
//             onChange={(e) => setTo(e.target.value)}
//             disabled={loading}
//           />
//           <label htmlFor="amount" className="transfer-label">
//             Amount (ETH) <span style={{ color: "#aaa", fontSize: 13 }}>(for each item)</span>
//           </label>
//           <input
//             id="amount"
//             className="transfer-input"
//             type="number"
//             step="0.0001"
//             min="0"
//             placeholder="Amount in ETH"
//             value={amount}
//             onChange={(e) => setAmount(e.target.value)}
//             disabled={loading}
//           />
//           {/* ETH to USD conversion shown here */}
//           {amount && ethUsd && !isNaN(Number(amount)) && (
//             <div
//               style={{
//                 fontSize: 15,
//                 color: "#226cf6",
//                 fontWeight: 600,
//                 marginBottom: 6,
//                 marginTop: -2,
//                 letterSpacing: "0.01em",
//               }}
//             >
//               ≈ {usdAmount}
//             </div>
//           )}
//           <button className="transfer-button-main" type="submit" disabled={loading}>
//             {loading
//               ? `Processing${selected.length > 1 ? ` ${selected.length}` : ""}...`
//               : selected.length > 1
//                 ? `Create ${selected.length} Offers`
//                 : "Create Offer"}
//           </button>
//         </form>
//         {message && (
//           <div
//             className={
//               "transfer-message" +
//               (message.startsWith("Error") ? " error" : "")
//             }
//           >
//             {message}
//           </div>
//         )}
//       </div>
//       {/* Your styles unchanged */}
//       <style>{`
//         .transfer-bg {
//           min-height: 100vh;
//           background: #f6f8fc;
//           padding-bottom: 60px;
//           font-family: 'Inter', system-ui, sans-serif;
//         }
//         .transfer-container {
//           max-width: 1100px;
//           margin: 44px auto 0 auto;
//           padding: 0 18px;
//         }
//         .transfer-title {
//           font-size: 2.2rem;
//           font-weight: 900;
//           margin-bottom: 9px;
//           color: #23283b;
//           letter-spacing: 0.01em;
//         }
//         .transfer-desc {
//           margin-bottom: 32px;
//           color: #5a6078;
//           font-size: 1.17rem;
//         }
//         .transfer-card-list {
//           display: flex;
//           flex-wrap: wrap;
//           gap: 28px;
//           margin-bottom: 28px;
//         }
//         .transfer-card {
//           background: #fff;
//           border-radius: 16px;
//           box-shadow: 0 2px 18px #edeef3;
//           padding: 22px 23px 14px 22px;
//           display: flex;
//           flex-direction: column;
//           align-items: flex-start;
//           min-width: 215px;
//           max-width: 260px;
//           transition: box-shadow .15s, border .15s, transform .11s;
//           border: 2.2px solid transparent;
//           position: relative;
//           cursor: pointer;
//         }
//         .transfer-card:hover {
//           border: 2.2px solid #226cf6;
//           box-shadow: 0 8px 28px #226cf619, 0 2px 12px #edeef322;
//           transform: translateY(-4px) scale(1.02);
//         }
//         .transfer-card.selected {
//           border: 2.2px solid #111 !important;
//           box-shadow: 0 8px 36px #1113, 0 2px 14px #edeef111;
//           background: #f7fafd !important;
//         }
//         .card-selected-check {
//           position: absolute;
//           top: 10px; right: 14px;
//           background: #226cf6;
//           color: #fff;
//           border-radius: 100%;
//           font-size: 1.15rem;
//           font-weight: 700;
//           width: 24px; height: 24px;
//           display: flex; align-items: center; justify-content: center;
//           box-shadow: 0 2px 8px #226cf622;
//           border: 2.2px solid #fff;
//           z-index: 2;
//         }
//         .card-type {
//           font-size: 2rem;
//           margin-bottom: 7px;
//         }
//         .card-title.animated-title {
//           font-size: 1.1rem;
//           font-weight: 700;
//           color: #23283b;
//           margin-bottom: 7px;
//           letter-spacing: 0.02em;
//           background: linear-gradient(90deg, #6366f1 40%, #0091ff 80%, #181a23 120%);
//           background-size: 200% 100%;
//           -webkit-background-clip: text;
//           -webkit-text-fill-color: transparent;
//         }
//         @keyframes shimmer-casino {
//           0% { background-position: 120% 0; }
//           100% { background-position: -120% 0; }
//         }
//         .card-detail {
//           color: #69718a;
//           font-size: 1rem;
//           margin-bottom: 3px;
//         }
//         .card-id {
//           font-size: 0.93rem;
//           color: #b0b2c3;
//           margin-top: 6px;
//         }
//         .transfer-form {
//           margin: 0 auto;
//           max-width: 350px;
//           display: flex; flex-direction: column; gap: 10px;
//           background: #fff;
//           padding: 20px 22px 17px 22px;
//           border-radius: 14px;
//           box-shadow: 0 1.5px 12px #edeef1;
//           margin-bottom: 34px;
//         }
//         .transfer-label {
//           font-weight: 600;
//           margin-bottom: 2px;
//           color: #23283b;
//         }
//         .transfer-input {
//           padding: 7px 10px;
//           border-radius: 7px;
//           border: 1px solid #d1d5db;
//           font-size: 1.07rem;
//           margin-bottom: 7px;
//           background: #fafcff;
//           outline: none;
//           transition: border .13s;
//         }
//         .transfer-input:focus {
//           border: 1.5px solid #226cf6;
//           background: #fff;
//         }
//         .transfer-button-main {
//           background: linear-gradient(90deg,#226cf6,#17c9ff 120%);
//           color: #fff;
//           border: none;
//           font-weight: 700;
//           padding: 11px 0;
//           border-radius: 10px;
//           font-size: 1.13rem;
//           margin-top: 8px;
//           box-shadow: 0 1.5px 9px #226cf615;
//           cursor: pointer;
//           transition: background .17s,box-shadow .15s;
//         }
//         .transfer-button-main:disabled {
//           opacity: 0.68;
//           cursor: not-allowed;
//         }
//         .transfer-button-main:hover {
//           background: linear-gradient(90deg,#111,#17c9ff 140%);
//           box-shadow: 0 4px 16px #17c9ff17;
//         }
//         .transfer-message {
//           margin-top: 28px;
//           font-weight: 500;
//           color: #2cb72c;
//         }
//         .transfer-message.error {
//           color: #e44;
//         }
//         @media (max-width: 750px) {
//           .transfer-card-list {
//             flex-direction: column;
//           }
//           .transfer-container { padding: 0 2vw; }
//         }
//       `}</style>
//     </div>
//   );
// }


import React, { useEffect, useState } from "react";
import {
  getProvider,
  getMyNFTs,
  createBatchOffers,
} from "../contractUtils";

export default function Transfer({ user }) {
  const [address, setAddress] = useState(null);
  const [nfts, setNfts] = useState([]);
  const [selected, setSelected] = useState([]);
  const [to, setTo] = useState("");
  const [amountUsd, setAmountUsd] = useState(""); // now in USD
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [ethUsd, setEthUsd] = useState(null);

  // Fetch ETH price in USD
  useEffect(() => {
    async function fetchEthPrice() {
      try {
        const res = await fetch(
          "https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd"
        );
        const data = await res.json();
        setEthUsd(data?.ethereum?.usd || null);
      } catch {
        setEthUsd(null);
      }
    }
    fetchEthPrice();
    const interval = setInterval(fetchEthPrice, 120000);
    return () => clearInterval(interval);
  }, []);

  // Fetch NFTs
  useEffect(() => {
    async function fetchData() {
      const provider = await getProvider();
      const signer = provider.getSigner();
      const userAddress = await signer.getAddress();
      setAddress(userAddress);
      setNfts(await getMyNFTs(userAddress));
    }
    fetchData();
  }, [user]);

  function toggleSelected(tokenId) {
    setSelected((prev) =>
      prev.includes(tokenId)
        ? prev.filter((id) => id !== tokenId)
        : [...prev, tokenId]
    );
  }

  // Convert USD to ETH
  const amountEth =
    ethUsd && amountUsd && !isNaN(Number(amountUsd))
      ? (parseFloat(amountUsd) / ethUsd).toFixed(6)
      : "";

  async function handleCreateOffer(e) {
    e.preventDefault();
    if (!selected.length || !to || !amountUsd) {
      setMessage("Select one or more assets, recipient, and amount.");
      return;
    }
    setMessage("");
    setLoading(true);
    try {
      // send ETH value to contract, not USD
      await createBatchOffers(selected, to, amountEth);
      setMessage(
        selected.length > 1
          ? `Offers created for ${selected.length} items!`
          : "Offer created!"
      );
      setTo("");
      setAmountUsd("");
      setSelected([]);
    } catch (err) {
      setMessage("Error: " + (err?.message || err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="transfer-bg">
      <div className="transfer-container">
        <h1 className="transfer-title">Send Trade Offer</h1>
        <div className="transfer-desc">
          Select <b>one or more assets</b>, enter recipient wallet, and set price <b>(USD)</b> to create offers.<br />
          Recipient must accept and pay for trade to complete!
        </div>
        <div className="transfer-card-list">
          {nfts.map((nft) => (
            <div
              key={nft.tokenId}
              className={
                "transfer-card" +
                (selected.includes(nft.tokenId) ? " selected" : "")
              }
              onClick={() => toggleSelected(nft.tokenId)}
            >
              <div className="card-type">
                {nft.itemType === "car" ? "🚗" : "🏠"}
              </div>
              <div className="card-title animated-title">{nft.name}</div>
              <div className="card-detail">
                {nft.itemType === "car"
                  ? `VIN: ${nft.vin}`
                  : `Address: ${nft.addr}`}
              </div>
              <div className="card-value" style={{fontWeight: 700, color: "#226cf6", marginBottom: 2}}>
                Value: ${(nft.value ?? 0).toLocaleString("en-US")} USD
              </div>
              <div className="card-id">NFT ID: {nft.tokenId}</div>
              {selected.includes(nft.tokenId) && (
                <span className="card-selected-check">✓</span>
              )}
            </div>
          ))}
        </div>
        <form onSubmit={handleCreateOffer} className="transfer-form">
          <label htmlFor="to" className="transfer-label">
            Recipient Wallet Address
          </label>
          <input
            id="to"
            className="transfer-input"
            type="text"
            placeholder="0x..."
            value={to}
            onChange={(e) => setTo(e.target.value)}
            disabled={loading}
          />
          <label htmlFor="amount" className="transfer-label">
            Amount (USD) <span style={{ color: "#aaa", fontSize: 13 }}>(for each item)</span>
          </label>
          <input
            id="amount"
            className="transfer-input"
            type="number"
            step="0.01"
            min="0"
            placeholder="Amount in USD"
            value={amountUsd}
            onChange={(e) => setAmountUsd(e.target.value)}
            disabled={loading}
          />
          {/* USD to ETH conversion shown here */}
          {amountUsd && ethUsd && !isNaN(Number(amountUsd)) && (
            <div
              style={{
                fontSize: 15,
                color: "#226cf6",
                fontWeight: 600,
                marginBottom: 6,
                marginTop: -2,
                letterSpacing: "0.01em",
              }}
            >
              ≈ {amountEth} ETH
            </div>
          )}
          <button className="transfer-button-main" type="submit" disabled={loading}>
            {loading
              ? `Processing${selected.length > 1 ? ` ${selected.length}` : ""}...`
              : selected.length > 1
                ? `Create ${selected.length} Offers`
                : "Create Offer"}
          </button>
        </form>
        {message && (
          <div
            className={
              "transfer-message" +
              (message.startsWith("Error") ? " error" : "")
            }
          >
            {message}
          </div>
        )}
      </div>
      {/* styles unchanged */}
      <style>{`
        .transfer-bg {
          min-height: 100vh;
          background: #f6f8fc;
          padding-bottom: 60px;
          font-family: 'Inter', system-ui, sans-serif;
        }
        .transfer-container {
          max-width: 1100px;
          margin: 44px auto 0 auto;
          padding: 0 18px;
        }
        .transfer-title {
          font-size: 2.2rem;
          font-weight: 900;
          margin-bottom: 9px;
          color: #23283b;
          letter-spacing: 0.01em;
        }
        .transfer-desc {
          margin-bottom: 32px;
          color: #5a6078;
          font-size: 1.17rem;
        }
        .transfer-card-list {
          display: flex;
          flex-wrap: wrap;
          gap: 28px;
          margin-bottom: 28px;
        }
        .transfer-card {
          background: #fff;
          border-radius: 16px;
          box-shadow: 0 2px 18px #edeef3;
          padding: 22px 23px 14px 22px;
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          min-width: 215px;
          max-width: 260px;
          transition: box-shadow .15s, border .15s, transform .11s;
          border: 2.2px solid transparent;
          position: relative;
          cursor: pointer;
        }
        .transfer-card:hover {
          border: 2.2px solid #226cf6;
          box-shadow: 0 8px 28px #226cf619, 0 2px 12px #edeef322;
          transform: translateY(-4px) scale(1.02);
        }
        .transfer-card.selected {
          border: 2.2px solid #111 !important;
          box-shadow: 0 8px 36px #1113, 0 2px 14px #edeef111;
          background: #f7fafd !important;
        }
        .card-selected-check {
          position: absolute;
          top: 10px; right: 14px;
          background: #226cf6;
          color: #fff;
          border-radius: 100%;
          font-size: 1.15rem;
          font-weight: 700;
          width: 24px; height: 24px;
          display: flex; align-items: center; justify-content: center;
          box-shadow: 0 2px 8px #226cf622;
          border: 2.2px solid #fff;
          z-index: 2;
        }
        .card-type {
          font-size: 2rem;
          margin-bottom: 7px;
        }
        .card-title.animated-title {
          font-size: 1.1rem;
          font-weight: 700;
          color: #23283b;
          margin-bottom: 7px;
          letter-spacing: 0.02em;
          background: linear-gradient(90deg, #6366f1 40%, #0091ff 80%, #181a23 120%);
          background-size: 200% 100%;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        @keyframes shimmer-casino {
          0% { background-position: 120% 0; }
          100% { background-position: -120% 0; }
        }
        .card-detail {
          color: #69718a;
          font-size: 1rem;
          margin-bottom: 3px;
        }
        .card-value {
          font-size: 1.02rem;
          margin-bottom: 3px;
        }
        .card-id {
          font-size: 0.93rem;
          color: #b0b2c3;
          margin-top: 6px;
        }
        .transfer-form {
          margin: 0 auto;
          max-width: 350px;
          display: flex; flex-direction: column; gap: 10px;
          background: #fff;
          padding: 20px 22px 17px 22px;
          border-radius: 14px;
          box-shadow: 0 1.5px 12px #edeef1;
          margin-bottom: 34px;
        }
        .transfer-label {
          font-weight: 600;
          margin-bottom: 2px;
          color: #23283b;
        }
        .transfer-input {
          padding: 7px 10px;
          border-radius: 7px;
          border: 1px solid #d1d5db;
          font-size: 1.07rem;
          margin-bottom: 7px;
          background: #fafcff;
          outline: none;
          transition: border .13s;
        }
        .transfer-input:focus {
          border: 1.5px solid #226cf6;
          background: #fff;
        }
        .transfer-button-main {
          background: linear-gradient(90deg,#226cf6,#17c9ff 120%);
          color: #fff;
          border: none;
          font-weight: 700;
          padding: 11px 0;
          border-radius: 10px;
          font-size: 1.13rem;
          margin-top: 8px;
          box-shadow: 0 1.5px 9px #226cf615;
          cursor: pointer;
          transition: background .17s,box-shadow .15s;
        }
        .transfer-button-main:disabled {
          opacity: 0.68;
          cursor: not-allowed;
        }
        .transfer-button-main:hover {
          background: linear-gradient(90deg,#111,#17c9ff 140%);
          box-shadow: 0 4px 16px #17c9ff17;
        }
        .transfer-message {
          margin-top: 28px;
          font-weight: 500;
          color: #2cb72c;
        }
        .transfer-message.error {
          color: #e44;
        }
        @media (max-width: 750px) {
          .transfer-card-list {
            flex-direction: column;
          }
          .transfer-container { padding: 0 2vw; }
        }
      `}</style>
    </div>
  );
}
