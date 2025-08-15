import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

export default function Sidebar({ onLogout }) {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { label: "Inventory", to: "/inventory" },
    { label: "Transfer", to: "/transfer" },
  ];

  return (
    <>
      <div className="hamburger" onClick={() => setOpen(!open)}>
        <span>&#9776;</span>
      </div>
      <div className={`sidebar ${open ? "open" : ""}`}>
        <div className="sidebar-header">
          <span style={{ fontWeight: 700, fontSize: 24 }}>☰</span>
          <span style={{ marginLeft: 12, fontWeight: 600 }}>Virtual Wallet</span>
        </div>
        <div className="sidebar-links">
          {menuItems.map((item) => (
            <div
              key={item.label}
              className={"sidebar-link" + (location.pathname === item.to ? " active" : "")}
              onClick={() => {
                navigate(item.to);
                setOpen(false);
              }}
            >
              {item.label}
            </div>
          ))}
        </div>
        <div className="sidebar-logout">
          <button className="logout-btn" onClick={() => { setOpen(false); onLogout(); }}>Log Out</button>
        </div>
      </div>
      <style>{`
        .hamburger {
          position: fixed;
          left: 14px; top: 17px;
          font-size: 2.1rem;
          z-index: 1101;
          cursor: pointer;
          color: #3730a3;
          background: #fff;
          border-radius: 8px;
          padding: 3px 12px;
          box-shadow: 0 1px 8px #2d2c4008;
        }
        .sidebar {
          position: fixed;
          top: 0; left: 0;
          height: 100vh;
          width: 235px;
          background: linear-gradient(180deg,#4f46e5 80%,#5eead4 120%);
          color: #fff;
          transform: translateX(-100%);
          transition: transform 0.23s cubic-bezier(.3,1.13,.5,1.01);
          z-index: 1100;
          display: flex;
          flex-direction: column;
        }
        .sidebar.open {
          transform: translateX(0);
        }
        .sidebar-header {
          padding: 23px 18px 18px 25px;
          font-size: 1.3rem;
          display: flex;
          align-items: center;
        }
        .sidebar-links {
          flex: 1;
          padding-left: 25px;
        }
        .sidebar-link {
          margin-bottom: 18px;
          font-size: 1.12rem;
          font-weight: 500;
          cursor: pointer;
          border-radius: 7px;
          padding: 7px 15px 7px 5px;
          transition: background .16s, color .16s;
        }
        .sidebar-link.active, .sidebar-link:hover {
          background: #fff2;
          color: #22d3ee;
        }
        .sidebar-logout {
          padding: 24px 28px;
        }
        .logout-btn {
          background: #fff;
          color: #e11d48;
          border: none;
          border-radius: 8px;
          font-size: 1.07rem;
          font-weight: 700;
          padding: 10px 0;
          width: 100%;
          box-shadow: 0 2px 8px #22d3ee10;
          cursor: pointer;
        }
        .logout-btn:hover {
          background: #e11d48;
          color: #fff;
        }
      `}</style>
    </>
  );
}
