// // import { useState } from 'react'
// // import reactLogo from './assets/react.svg'
// // import viteLogo from './assets/vite.svg'
// // import heroImg from './assets/hero.png'
// // import './App.css'

// // function App() {
// //   const [count, setCount] = useState(0)

// //   return (
// //     <>
// //       <section id="center">
// //         <div className="hero">
// //           <img src={heroImg} className="base" width="170" height="179" alt="" />
// //           <img src={reactLogo} className="framework" alt="React logo" />
// //           <img src={viteLogo} className="vite" alt="Vite logo" />
// //         </div>
// //         <div>
// //           <h1>Get started</h1>
// //           <p>
// //             Edit <code>src/App.jsx</code> and save to test <code>HMR</code>
// //           </p>
// //         </div>
// //         <button
// //           type="button"
// //           className="counter"
// //           onClick={() => setCount((count) => count + 1)}
// //         >
// //           Count is {count}
// //         </button>
// //       </section>

// //       <div className="ticks"></div>

// //       <section id="next-steps">
// //         <div id="docs">
// //           <svg className="icon" role="presentation" aria-hidden="true">
// //             <use href="/icons.svg#documentation-icon"></use>
// //           </svg>
// //           <h2>Documentation</h2>
// //           <p>Your questions, answered</p>
// //           <ul>
// //             <li>
// //               <a href="https://vite.dev/" target="_blank">
// //                 <img className="logo" src={viteLogo} alt="" />
// //                 Explore Vite
// //               </a>
// //             </li>
// //             <li>
// //               <a href="https://react.dev/" target="_blank">
// //                 <img className="button-icon" src={reactLogo} alt="" />
// //                 Learn more
// //               </a>
// //             </li>
// //           </ul>
// //         </div>
// //         <div id="social">
// //           <svg className="icon" role="presentation" aria-hidden="true">
// //             <use href="/icons.svg#social-icon"></use>
// //           </svg>
// //           <h2>Connect with us</h2>
// //           <p>Join the Vite community</p>
// //           <ul>
// //             <li>
// //               <a href="https://github.com/vitejs/vite" target="_blank">
// //                 <svg
// //                   className="button-icon"
// //                   role="presentation"
// //                   aria-hidden="true"
// //                 >
// //                   <use href="/icons.svg#github-icon"></use>
// //                 </svg>
// //                 GitHub
// //               </a>
// //             </li>
// //             <li>
// //               <a href="https://chat.vite.dev/" target="_blank">
// //                 <svg
// //                   className="button-icon"
// //                   role="presentation"
// //                   aria-hidden="true"
// //                 >
// //                   <use href="/icons.svg#discord-icon"></use>
// //                 </svg>
// //                 Discord
// //               </a>
// //             </li>
// //             <li>
// //               <a href="https://x.com/vite_js" target="_blank">
// //                 <svg
// //                   className="button-icon"
// //                   role="presentation"
// //                   aria-hidden="true"
// //                 >
// //                   <use href="/icons.svg#x-icon"></use>
// //                 </svg>
// //                 X.com
// //               </a>
// //             </li>
// //             <li>
// //               <a href="https://bsky.app/profile/vite.dev" target="_blank">
// //                 <svg
// //                   className="button-icon"
// //                   role="presentation"
// //                   aria-hidden="true"
// //                 >
// //                   <use href="/icons.svg#bluesky-icon"></use>
// //                 </svg>
// //                 Bluesky
// //               </a>
// //             </li>
// //           </ul>
// //         </div>
// //       </section>

// //       <div className="ticks"></div>
// //       <section id="spacer"></section>
// //     </>
// //   )
// // }

// // export default App


// import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
// import Assets from './pages/Assets';
// import TicketRegistration from './pages/TicketRegistration';
// import './App.css';

// function App() {
//   return (
//     <Router>
//       <div className="app">
//         {/* Navigation */}
//         <nav className="main-nav">
//           <Link to="/" className="nav-link">🎫 Tickets</Link>
//           <Link to="/assets" className="nav-link">📦 Assets</Link>
//         </nav>

//         {/* Routes */}
//         <Routes>
//           <Route path="/" element={<TicketRegistration />} />
//           <Route path="/assets" element={<Assets />} />
//         </Routes>
//       </div>
//     </Router>
//   );
// }

// export default App;




import { BrowserRouter as Router, Routes, Route, NavLink } from 'react-router-dom';
import TicketRegistration from './pages/TicketRegistration'; // Original
import Dashboard from './pages/Dashboard';
import TicketList from './pages/TicketList'; // New Admin Page
import AIChat from './pages/AIChat';
import './App.css';

function App() {
  return (
    <Router>
      <div className="app">
        <nav className="main-nav">
          <div className="sidebar-header">
            <div className="logo-icon-small">🛡️</div>
            <h2>NIRA CRM</h2>
          </div>
          
          <div className="nav-links">
            <NavLink to="/" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
              <span className="icon">📊</span> Dashboard
            </NavLink>

            <NavLink to="/requests" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
              <span className="icon">🎫</span> My Requests
            </NavLink>

            <NavLink to="/tickets/all" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
              <span className="icon">📋</span> All Tickets
            </NavLink>
            
            <NavLink to="/chat" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
              <span className="icon">🤖</span> AI Chat
            </NavLink>
          </div>
        </nav>

        <main className="main-content">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/requests" element={<TicketRegistration />} />
            <Route path="/tickets/all" element={<TicketList />} />
            <Route path="/chat" element={<AIChat />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;