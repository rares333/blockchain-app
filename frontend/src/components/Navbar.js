import React from "react";
import { Link, useLocation } from "react-router-dom";

export default function Navbar({
  balance,
  onLogout,
  search,
  setSearch,
  handleSearch,
}) {
  const location = useLocation();

  return (
    <header className="navbar-bg">
      <nav className="navbar">
        <div className="navbar-logo-section">
          <span className="navbar-logo">
            Rares<span className="dot">.</span>
          </span>
          <div className="navbar-menu">
            <Link to="/inventory" className={location.pathname === "/inventory" ? "navbar-link active" : "navbar-link"}>
              Inventory
            </Link>
            <Link to="/transfer" className={location.pathname === "/transfer" ? "navbar-link active" : "navbar-link"}>
              Transfer
            </Link>
            <Link to="/offers" className={location.pathname === "/offers" ? "navbar-link active" : "navbar-link"}>
              Offers
            </Link>
            <Link to="/about" className={location.pathname === "/about" ? "navbar-link active" : "navbar-link"}>
              About
            </Link>
          </div>
        </div>
        <div className="navbar-actions">
          <form className="navbar-search" onSubmit={handleSearch} autoComplete="off">
            <input
              type="text"
              placeholder="Search…"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
            <button type="submit">
              <span style={{ fontWeight: 600 }}>Search</span>
            </button>
          </form>
          <div className="navbar-balance-chip" title="Wallet balance">
            <span className="coin-emoji" role="img" aria-label="coin">🪙</span>
            <span className="navbar-balance-amount">
              {balance ? parseFloat(balance).toFixed(4) : "0.0000"}
            </span>
            <span className="navbar-balance-currency">ETH</span>
          </div>
          <button className="navbar-logout" onClick={onLogout}>
            Logout
          </button>
        </div>
      </nav>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;900&display=swap');
        .navbar-bg {
          width: 100%;
          background: #fff;
          border-bottom: 1.5px solid #ececf0;
          font-family: 'Inter', system-ui, sans-serif;
        }
        .navbar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          max-width: 1200px;
          margin: 0 auto;
          padding: 18px 22px 12px 22px;
        }
        .navbar-logo-section {
          display: flex;
          align-items: center;
          gap: 32px;
        }
        .navbar-logo {
          font-size: 2.2rem;
          font-weight: 900;
          color: #20212a;
          letter-spacing: 0.01em;
          line-height: 1.1;
          min-width: 105px;
          user-select: none;
        }
        .dot {
          color: #262cff;
          font-size: 1.8rem;
        }
        .navbar-menu {
          display: flex;
          align-items: center;
          gap: 28px;
        }
        .navbar-link {
          font-size: 1.09rem;
          font-weight: 500;
          color: #757793;
          text-decoration: none;
          border-bottom: 2px solid transparent;
          padding-bottom: 2px;
          transition: color .13s, border .13s;
        }
        .navbar-link.active {
          color: #20212a;
          border-bottom: 2px solid #222cff;
          font-weight: 700;
        }
        .navbar-actions {
          display: flex;
          align-items: center;
          gap: 18px;
        }
        .navbar-search {
          display: flex;
          align-items: center;
          gap: 5px;
          margin-right: 12px;
        }
        .navbar-search input {
          border: 1.2px solid #e3e7ef;
          border-radius: 6px;
          font-size: 1rem;
          padding: 7px 12px;
          background: #f7f8fa;
          outline: none;
          transition: border .12s;
        }
        .navbar-search input:focus {
          border: 1.5px solid #262cff;
          background: #fff;
        }
        .navbar-search button {
          background: #222cff;
          color: #fff;
          font-weight: 600;
          border: none;
          border-radius: 6px;
          font-size: 1rem;
          padding: 7px 15px;
          cursor: pointer;
          transition: background .14s;
        }
        .navbar-search button:hover {
          background: #0a1675;
        }
        .navbar-balance-chip {
          display: flex;
          align-items: center;
          background: #f4f6fb;
          color: #181a23;
          border-radius: 26px;
          padding: 6px 18px 6px 13px;
          font-size: 1.11rem;
          font-weight: 700;
          border: 1px solid #ececf0;
          gap: 7px;
          min-width: 110px;
          margin-right: 2px;
          box-shadow: 0 1.5px 10px #e7eaf233;
        }
        .coin-emoji {
          font-size: 1.4em;
          margin-right: 2px;
          animation: coin-spin 1.3s linear infinite;
          filter: drop-shadow(0 1px 4px #0001);
          vertical-align: middle;
          display: inline-block;
          transform-origin: 60% 58%;
        }
        @keyframes coin-spin {
          0% { transform: rotateY(0deg);}
          65% { transform: rotateY(380deg);}
          100% { transform: rotateY(360deg);}
        }
        .navbar-balance-amount {
          font-weight: 900;
          letter-spacing: 0.01em;
        }
        .navbar-balance-currency {
          color: #8891b0;
          font-size: 0.98em;
          font-weight: 700;
          margin-left: 5px;
          letter-spacing: 0.03em;
        }
        .navbar-logout {
          background: none;
          border: none;
          color: #222cff;
          font-weight: 700;
          font-size: 1.08rem;
          cursor: pointer;
          padding: 0 0 0 8px;
          transition: color .13s;
        }
        .navbar-logout:hover {
          color: #e11d48;
        }
        @media (max-width: 900px) {
          .navbar {
            flex-direction: column;
            gap: 11px;
            align-items: flex-start;
            padding: 13px 5vw 8px 5vw;
          }
          .navbar-actions { margin-top: 7px; }
        }
        @media (max-width: 650px) {
          .navbar-logo-section { flex-direction: column; gap: 7px; }
          .navbar-logo { font-size: 1.48rem; min-width: 0; }
          .navbar-actions { flex-direction: column; gap: 5px; }
          .navbar-menu { gap: 12px; }
        }
      `}</style>
    </header>
  );
}
