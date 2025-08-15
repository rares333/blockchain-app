import React from "react";

export default function About() {
  return (
    <div className="about-bg">
      <div className="about-container">
        <div className="chatbot-card">
          <div className="chatbot-avatar">🤖</div>
          <div className="chatbot-message">
            <h2 style={{margin:0, fontWeight:800}}>Welcome to my project!</h2>
            <div style={{marginTop:13, fontSize:17, color:"#555"}}>
              This is a blockchain-powered virtual wallet for property NFTs (cars and houses).
              You can view, transfer, and manage your digital assets in a beautiful interface.
              <br/><br/>
              <b>Demo logins:</b><br/>
              CNP: <code>5000612430017</code><br/>
              Password: <code>T12</code>
              <br />
              <span style={{fontSize:13, color:"#999"}}>For more demo accounts see <code>demoAccounts.js</code></span>
            </div>
          </div>
        </div>
      </div>
      <style>{`
        .about-bg {
          min-height: 100vh;
          background: linear-gradient(120deg, #f8fafc 70%, #e0e7ff 100%);
          padding-top: 80px;
        }
        .about-container {
          display: flex; align-items: center; justify-content: center; min-height: 70vh;
        }
        .chatbot-card {
          background: #fff;
          border-radius: 25px;
          box-shadow: 0 10px 30px #6366f122;
          display: flex; align-items: flex-start;
          gap: 30px;
          padding: 48px 44px;
          max-width: 520px;
        }
        .chatbot-avatar {
          font-size: 3.5rem;
          margin-right: 7px;
          align-self: flex-start;
        }
        .chatbot-message {
          font-size: 1.16rem;
          color: #27232d;
        }
      `}</style>
    </div>
  );
}
