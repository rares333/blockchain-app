// import React, { useState, useEffect } from "react";
// import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
// import Navbar from "./components/Navbar";
// import Inventory from "./components/Inventory";
// import Transfer from "./components/Transfer";
// import Offers from "./components/Offers";        // <-- ADD THIS LINE
// import About from "./components/About";
// import Login from "./components/Login";
// import { getEthBalance } from "./contractUtils"; // <-- Import balance fetcher!

// function App() {
//   const [user, setUser] = useState(null);
//   const [balance, setBalance] = useState("0");
//   const [search, setSearch] = useState("");

//   useEffect(() => {
//     let interval;
//     async function fetchBalance() {
//       if (user && user.address) {
//         const bal = await getEthBalance(user.address);
//         setBalance(bal);
//       }
//     }
//     fetchBalance();
//     if (user && user.address) {
//       interval = setInterval(fetchBalance, 10000);
//     }
//     return () => interval && clearInterval(interval);
//   }, [user]);

//   function handleSearch(e) {
//     e.preventDefault();
//     setSearch(search.trim());
//   }

//   const handleLogout = () => {
//     setUser(null);
//     setBalance("0");
//     setSearch("");
//   };

//   return (
//     <Router>
//       {user && (
//         <Navbar
//           onLogout={handleLogout}
//           search={search}
//           setSearch={setSearch}
//           handleSearch={handleSearch}
//           balance={balance}
//         />
//       )}
//       <Routes>
//         {!user ? (
//           <Route path="*" element={<Login onLogin={setUser} />} />
//         ) : (
//           <>
//             <Route
//               path="/inventory"
//               element={
//                 <Inventory
//                   user={user}
//                   search={search}
//                   setSearch={setSearch}
//                   balance={balance}
//                 />
//               }
//             />
//             <Route path="/offers" element={<Offers user={user} balance={balance} />} />
//             <Route
//               path="/transfer"
//               element={<Transfer user={user} balance={balance} />}
//             />
//             <Route
//               path="/about"
//               element={<About balance={balance} />}
//             />
//             <Route path="*" element={<Navigate to="/inventory" />} />
//           </>
//         )}
//       </Routes>
//     </Router>
//   );
// }

// export default App;


// import React, { useState, useEffect } from "react";
// import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";
// import Navbar from "./components/Navbar";
// import Inventory from "./components/Inventory";
// import Transfer from "./components/Transfer";
// import Offers from "./components/Offers";
// import About from "./components/About";
// import Login from "./components/Login";
// import { getEthBalance } from "./contractUtils";
// import { AnimatePresence, motion } from "framer-motion";

// // --- Page Transition Variants ---
// const pageVariants = {
//   initial: { opacity: 0, y: 30, scale: 0.99 },
//   in:      { opacity: 1, y: 0, scale: 1, transition: { duration: 0.24 } },
//   out:     { opacity: 0, y: -15, scale: 0.98, transition: { duration: 0.19 } }
// };

// function AnimatedRoutes({ user, search, setSearch, balance, handleLogout, handleSearch }) {
//   const location = useLocation();

//   return (
//     <>
//       {user && (
//         <Navbar
//           onLogout={handleLogout}
//           search={search}
//           setSearch={setSearch}
//           handleSearch={handleSearch}
//           balance={balance}
//         />
//       )}
//       <AnimatePresence mode="wait" initial={false}>
//         <Routes location={location} key={location.pathname}>
//           {!user ? (
//             <Route path="*" element={
//               <motion.div
//                 variants={pageVariants}
//                 initial="initial"
//                 animate="in"
//                 exit="out"
//                 style={{ minHeight: "100vh" }}
//               >
//                 <Login onLogin={handleLogout} />
//               </motion.div>
//             } />
//           ) : (
//             <>
//               <Route path="/inventory" element={
//                 <motion.div
//                   variants={pageVariants}
//                   initial="initial"
//                   animate="in"
//                   exit="out"
//                   style={{ minHeight: "100vh" }}
//                 >
//                   <Inventory user={user} search={search} setSearch={setSearch} balance={balance} />
//                 </motion.div>
//               } />
//               <Route path="/offers" element={
//                 <motion.div
//                   variants={pageVariants}
//                   initial="initial"
//                   animate="in"
//                   exit="out"
//                   style={{ minHeight: "100vh" }}
//                 >
//                   <Offers user={user} balance={balance} />
//                 </motion.div>
//               } />
//               <Route path="/transfer" element={
//                 <motion.div
//                   variants={pageVariants}
//                   initial="initial"
//                   animate="in"
//                   exit="out"
//                   style={{ minHeight: "100vh" }}
//                 >
//                   <Transfer user={user} balance={balance} />
//                 </motion.div>
//               } />
//               <Route path="/about" element={
//                 <motion.div
//                   variants={pageVariants}
//                   initial="initial"
//                   animate="in"
//                   exit="out"
//                   style={{ minHeight: "100vh" }}
//                 >
//                   <About balance={balance} />
//                 </motion.div>
//               } />
//               <Route path="*" element={<Navigate to="/inventory" />} />
//             </>
//           )}
//         </Routes>
//       </AnimatePresence>
//     </>
//   );
// }

// export default function App() {
//   const [user, setUser] = useState(null);
//   const [balance, setBalance] = useState("0");
//   const [search, setSearch] = useState("");

//   useEffect(() => {
//     let interval;
//     async function fetchBalance() {
//       if (user && user.address) {
//         const bal = await getEthBalance(user.address);
//         setBalance(bal);
//       }
//     }
//     fetchBalance();
//     if (user && user.address) {
//       interval = setInterval(fetchBalance, 10000);
//     }
//     return () => interval && clearInterval(interval);
//   }, [user]);

//   function handleSearch(e) {
//     e.preventDefault();
//     setSearch(search.trim());
//   }

//   const handleLogout = () => {
//     setUser(null);
//     setBalance("0");
//     setSearch("");
//   };

//   return (
//     <Router>
//       <AnimatedRoutes
//         user={user}
//         search={search}
//         setSearch={setSearch}
//         balance={balance}
//         handleLogout={handleLogout}
//         handleSearch={handleSearch}
//       />
//     </Router>
//   );
// }


import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import Inventory from "./components/Inventory";
import Transfer from "./components/Transfer";
import Offers from "./components/Offers";
import About from "./components/About";
import Login from "./components/Login";
import { getEthBalance } from "./contractUtils";
import { AnimatePresence, motion } from "framer-motion";

// --- Page Transition Variants ---
const pageVariants = {
  initial: { opacity: 0, y: 30, scale: 0.99 },
  in:      { opacity: 1, y: 0, scale: 1, transition: { duration: 0.24 } },
  out:     { opacity: 0, y: -15, scale: 0.98, transition: { duration: 0.19 } }
};

function AnimatedRoutes({ user, setUser, search, setSearch, balance, handleLogout, handleSearch }) {
  const location = useLocation();

  return (
    <>
      {user && (
        <Navbar
          onLogout={handleLogout}
          search={search}
          setSearch={setSearch}
          handleSearch={handleSearch}
          balance={balance}
          user={user}  // If your Navbar uses user for profile
        />
      )}
      <AnimatePresence mode="wait" initial={false}>
        <Routes location={location} key={location.pathname}>
          {!user ? (
            <Route path="*" element={
              <motion.div
                variants={pageVariants}
                initial="initial"
                animate="in"
                exit="out"
                style={{ minHeight: "100vh" }}
              >
                <Login onLogin={setUser} />  {/* <<<<--- FIXED: use setUser! */}
              </motion.div>
            } />
          ) : (
            <>
              <Route path="/inventory" element={
                <motion.div
                  variants={pageVariants}
                  initial="initial"
                  animate="in"
                  exit="out"
                  style={{ minHeight: "100vh" }}
                >
                  <Inventory user={user} search={search} setSearch={setSearch} balance={balance} />
                </motion.div>
              } />
              <Route path="/offers" element={
                <motion.div
                  variants={pageVariants}
                  initial="initial"
                  animate="in"
                  exit="out"
                  style={{ minHeight: "100vh" }}
                >
                  <Offers user={user} balance={balance} />
                </motion.div>
              } />
              <Route path="/transfer" element={
                <motion.div
                  variants={pageVariants}
                  initial="initial"
                  animate="in"
                  exit="out"
                  style={{ minHeight: "100vh" }}
                >
                  <Transfer user={user} balance={balance} />
                </motion.div>
              } />
              <Route path="/about" element={
                <motion.div
                  variants={pageVariants}
                  initial="initial"
                  animate="in"
                  exit="out"
                  style={{ minHeight: "100vh" }}
                >
                  <About balance={balance} />
                </motion.div>
              } />
              <Route path="*" element={<Navigate to="/inventory" />} />
            </>
          )}
        </Routes>
      </AnimatePresence>
    </>
  );
}

export default function App() {
  const [user, setUser] = useState(null);
  const [balance, setBalance] = useState("0");
  const [search, setSearch] = useState("");

  useEffect(() => {
    let interval;
    async function fetchBalance() {
      if (user && user.address) {
        const bal = await getEthBalance(user.address);
        setBalance(bal);
      }
    }
    fetchBalance();
    if (user && user.address) {
      interval = setInterval(fetchBalance, 10000);
    }
    return () => interval && clearInterval(interval);
  }, [user]);

  function handleSearch(e) {
    e.preventDefault();
    setSearch(search.trim());
  }

  const handleLogout = () => {
    setUser(null);
    setBalance("0");
    setSearch("");
  };

  return (
    <Router>
      <AnimatedRoutes
        user={user}
        setUser={setUser}     
        search={search}
        setSearch={setSearch}
        balance={balance}
        handleLogout={handleLogout}
        handleSearch={handleSearch}
      />
    </Router>
  );
}
