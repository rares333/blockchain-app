import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { DEMO_ACCOUNTS } from "../demoAccounts";

export default function Login({ onLogin }) {
  const [cnp, setCnp] = useState("");
  const [password, setPassword] = useState("");
  const [address, setAddress] = useState("");
  const [privateKey, setPrivateKey] = useState("");
  const [mode, setMode] = useState("login");
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");
  const navigate = useNavigate();

  function getUsers() {
    return JSON.parse(localStorage.getItem("users") || "{}");
  }
  function saveUser(cnp, password, address, privateKey) {
    const users = getUsers();
    users[cnp] = { password, address, privateKey };
    localStorage.setItem("users", JSON.stringify(users));
  }
  function handleLogin(e) {
    e.preventDefault();
    setError("");
    const users = getUsers();
    if (!users[cnp]) return setError("User not found.");
    if (users[cnp].password !== password) return setError("Incorrect password.");
    onLogin({ cnp, address: users[cnp].address, privateKey: users[cnp].privateKey });
    localStorage.setItem("lastUser", cnp); // Keep user for reload
    navigate("/inventory");
  }
  function handleRegister(e) {
    e.preventDefault();
    setError("");
    setInfo("");
    if (!cnp.match(/^\d{13}$/)) return setError("CNP must be 13 digits.");
    if (!/^0x[a-fA-F0-9]{40}$/.test(address)) return setError("Wallet address must be 0x + 40 hex chars.");
    if (!/^0x[a-fA-F0-9]{64}$/.test(privateKey)) return setError("Private key must be 0x + 64 hex chars.");
    if (!(address.toLowerCase() in DEMO_ACCOUNTS)) return setError("Address must be a demo Hardhat account.");
    if (DEMO_ACCOUNTS[address.toLowerCase()] !== privateKey) return setError("Private key doesn't match address.");
    saveUser(cnp, password, address, privateKey);
    setInfo("Account created! You can now log in.");
    setMode("login");
    setCnp(""); setPassword(""); setAddress(""); setPrivateKey("");
  }

  return (
    <div className="login-bg">
      <div className="login-card">
        <form onSubmit={mode === "login" ? handleLogin : handleRegister} className="login-form">
          <h2 style={{ margin: 0, fontWeight: 700, fontSize: 30 }}>{mode === "login" ? "Log in" : "Create Account"}</h2>
          <div style={{ color: "#888", fontSize: 15, marginBottom: 18 }}>
            {mode === "login"
              ? "Connect your wallet to continue."
              : "Fill in details with a Hardhat demo account."}
          </div>
          <div className="login-field">
            <label htmlFor="cnp">CNP</label>
            <input id="cnp" type="text" placeholder="Enter your CNP" value={cnp} onChange={e => setCnp(e.target.value)} required autoComplete="username" />
          </div>
          <div className="login-field">
            <label htmlFor="pw">Password</label>
            <input id="pw" type="password" placeholder="Enter your password" value={password} onChange={e => setPassword(e.target.value)} required autoComplete="current-password" />
          </div>
          {mode === "register" && (
            <>
              <div className="login-field">
                <label htmlFor="address">Wallet Address</label>
                <input id="address" type="text" placeholder="0x..." value={address} onChange={e => setAddress(e.target.value)} required />
              </div>
              <div className="login-field">
                <label htmlFor="privateKey">Private Key</label>
                <input id="privateKey" type="text" placeholder="0x..." value={privateKey} onChange={e => setPrivateKey(e.target.value)} required />
              </div>
            </>
          )}
          <button className="button-main" type="submit" style={{ marginTop: 10 }}>
            {mode === "login" ? "Log in" : "Create Account"}
          </button>
          {error && <div style={{ color: "#e11d48", marginTop: 10, fontWeight: 500 }}>{error}</div>}
          {info && <div style={{ color: "#2e7d32", marginTop: 10, fontWeight: 500 }}>{info}</div>}
          <button type="button" className="switch-btn" onClick={() => setMode(mode === "login" ? "register" : "login")}>
            {mode === "login" ? "Create Account" : "Back to Login"}
          </button>
        </form>
      </div>
      <style>{`
        .login-bg {
          min-height: 100vh;
          background: linear-gradient(120deg, #f8fafc 80%, #e0e7ff 100%);
          display: flex; align-items: center; justify-content: center;
        }
        .login-card {
          background: #fff;
          border-radius: 22px;
          box-shadow: 0 8px 32px #4f46e508, 0 2px 16px #0001;
          min-width: 370px; max-width: 97vw;
        }
        .login-form {
          display: flex; flex-direction: column; gap: 17px;
          padding: 38px 35px 32px 35px;
        }
        .login-field {
          display: flex; flex-direction: column; gap: 3px;
        }
        .login-field label {
          font-size: 15px; font-weight: 600;
          margin-bottom: 2px; color: #21214a;
        }
        .login-field input {
          padding: 9px 11px;
          border: 1.2px solid #d1d5db;
          border-radius: 7px; font-size: 15px;
          background: #f3f4f6;
          transition: border 0.18s; outline: none;
        }
        .login-field input:focus {
          border: 1.6px solid #6366f1;
          background: #fff;
        }
        .button-main {
          background: linear-gradient(90deg, #6366f1 70%, #5eead4 130%);
          border: none; color: #fff;
          font-size: 17px; font-weight: 700;
          padding: 10px 0;
          border-radius: 10px;
          cursor: pointer; margin-top: 7px;
          box-shadow: 0 2px 7px #6366f123;
        }
        .button-main:hover {
          background: linear-gradient(90deg, #4f46e5 70%, #14b8a6 130%);
        }
        .switch-btn {
          border: none; background: none;
          color: #4f46e5; font-weight: 600; font-size: 15px;
          cursor: pointer; margin-top: 20px; transition: color .15s;
        }
        .switch-btn:hover { color: #22d3ee; }
      `}</style>
    </div>
  );
}
