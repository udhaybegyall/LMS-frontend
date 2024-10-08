(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const r of document.querySelectorAll('link[rel="modulepreload"]'))a(r);new MutationObserver(r=>{for(const n of r)if(n.type==="childList")for(const s of n.addedNodes)s.tagName==="LINK"&&s.rel==="modulepreload"&&a(s)}).observe(document,{childList:!0,subtree:!0});function o(r){const n={};return r.integrity&&(n.integrity=r.integrity),r.referrerPolicy&&(n.referrerPolicy=r.referrerPolicy),r.crossOrigin==="use-credentials"?n.credentials="include":r.crossOrigin==="anonymous"?n.credentials="omit":n.credentials="same-origin",n}function a(r){if(r.ep)return;r.ep=!0;const n=o(r);fetch(r.href,n)}})();function y(e,t){e.innerHTML=`
        <div class="sidebar-header">
            <h1 class="logo">LMS</h1>
            ${t.role==="LIBRARIAN"?'<p class="role">Librarian</p>':""}
        </div>
        <nav class="sidebar-nav">
            ${t.role==="LIBRARIAN"?g():f()}
        </nav>
        <button id="logoutBtn" class="logout-btn">Logout</button>
    `,document.getElementById("logoutBtn").addEventListener("click",B)}function g(){return`
        <a href="#" class="nav-item" data-page="books">Manage Books</a>
        <a href="#" class="nav-item" data-page="members">Manage Members</a>
        <a href="#" class="nav-item" data-page="history">Borrow History</a>
        <a href="#" class="nav-item" data-page="deleted-members">Deleted Members</a>
    `}function f(){return`
        <a href="#" class="nav-item" data-page="available-books">Available Books</a>
        <a href="#" class="nav-item" data-page="borrowed-books">Borrowed Books</a>
        <a href="#" class="nav-item" data-page="history">Borrow History</a>
    `}function B(){localStorage.removeItem("token"),localStorage.removeItem("user"),window.location.reload()}const d="https://lms-backend-production-40f2.up.railway.app/api";function k(e){e.innerHTML=`
        <h2>Manage Books</h2>
        <button id="addBookBtn" class="action-btn">Add New Book</button>
        <div class="book-list">
            <table class="book-table">
                <thead>
                    <tr>
                        <th>Title</th>
                        <th>Author</th>
                        <th>ISBN</th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody id="bookTableBody"></tbody>
            </table>
        </div>
        <div id="bookModal" class="modal">
            <div class="modal-content">
                <span class="close">&times;</span>
                <div id="bookModalBody"></div>
            </div>
        </div>
    `,document.getElementById("addBookBtn").addEventListener("click",w),v()}async function v(){try{const e=localStorage.getItem("token"),t=await fetch(`${d}/books`,{headers:{Authorization:`Bearer ${e}`}});if(t.ok){const o=await t.json();E(o)}else throw new Error("Failed to fetch books")}catch(e){console.error("Error:",e),alert("Failed to fetch books. Please try again.")}}function E(e){const t=document.getElementById("bookTableBody");t.innerHTML="",e.forEach(r=>{const n=document.createElement("tr");n.innerHTML=`
            <td>${r.title}</td>
            <td>${r.author}</td>
            <td>${r.isbn}</td>
            <td>${r.status}</td>
            <td>
                <button class="update-book-btn" data-id="${r.id}">Update</button>
                <button class="remove-book-btn" data-id="${r.id}">Remove</button>
            </td>
        `,t.appendChild(n)}),document.querySelectorAll(".update-book-btn").forEach(r=>{r.addEventListener("click",n=>{const s=n.target.getAttribute("data-id");c(parseInt(s))})}),document.querySelectorAll(".remove-book-btn").forEach(r=>{r.addEventListener("click",n=>{const s=n.target.getAttribute("data-id");u(parseInt(s))})})}function w(){const e=document.getElementById("bookModal"),t=document.getElementById("bookModalBody");t.innerHTML=`
        <h2>Add New Book</h2>
        <form id="addBookForm" class="book-form">
            <input type="text" id="title" placeholder="Title" required>
            <input type="text" id="author" placeholder="Author" required>
            <input type="text" id="isbn" placeholder="ISBN" required>
            <button type="submit">Add Book</button>
        </form>
    `,document.getElementById("addBookForm").addEventListener("submit",I),e.style.display="block";const a=e.querySelector(".close");a.onclick=()=>{e.style.display="none"},window.onclick=r=>{r.target==e&&(e.style.display="none")}}async function I(e){e.preventDefault();const t=document.getElementById("title").value,o=document.getElementById("author").value,a=document.getElementById("isbn").value;try{const r=localStorage.getItem("token"),n=await fetch(`${d}/books`,{method:"POST",headers:{Authorization:`Bearer ${r}`,"Content-Type":"application/json"},body:JSON.stringify({title:t,author:o,isbn:a})});if(n.ok){const s=await n.json();alert("Book added successfully");const i=document.getElementById("bookModal");i.style.display="none",M(s)}else throw new Error("Failed to add book")}catch(r){console.error("Error:",r),alert("Failed to add book. Please try again.")}}function M(e){const t=document.getElementById("bookTableBody"),o=document.createElement("tr");o.innerHTML=`
        <td>${e.title}</td>
        <td>${e.author}</td>
        <td>${e.isbn}</td>
        <td>${e.status}</td>
        <td>
            <button class="update-book-btn" data-id="${e.id}">Update</button>
            <button class="remove-book-btn" data-id="${e.id}">Remove</button>
        </td>
    `,t.appendChild(o),o.querySelector(".update-book-btn").addEventListener("click",()=>c(e.id)),o.querySelector(".remove-book-btn").addEventListener("click",()=>u(e.id))}function c(e){const t=document.getElementById("bookModal"),o=document.getElementById("bookModalBody");o.innerHTML=`
        <h2>Update Book</h2>
        <form id="updateBookForm" class="book-form">
            <input type="text" id="updateTitle" placeholder="Title" required>
            <input type="text" id="updateAuthor" placeholder="Author" required>
            <input type="text" id="updateIsbn" placeholder="ISBN" required>
            <button type="submit">Update Book</button>
        </form>
    `,$(e),document.getElementById("updateBookForm").addEventListener("submit",n=>L(n,e)),t.style.display="block";const r=t.querySelector(".close");r.onclick=()=>{t.style.display="none"},window.onclick=n=>{n.target==t&&(t.style.display="none")}}async function $(e){try{const t=localStorage.getItem("token"),o=await fetch(`${d}/books/${e}`,{headers:{Authorization:`Bearer ${t}`}});if(o.ok){const a=await o.json();document.getElementById("updateTitle").value=a.title,document.getElementById("updateAuthor").value=a.author,document.getElementById("updateIsbn").value=a.isbn}else throw new Error("Failed to fetch book details")}catch(t){console.error("Error:",t),alert("Failed to fetch book details. Please try again.")}}async function L(e,t){e.preventDefault();const o=document.getElementById("updateTitle").value,a=document.getElementById("updateAuthor").value,r=document.getElementById("updateIsbn").value;try{const n=localStorage.getItem("token"),s=await fetch(`${d}/books/${t}`,{method:"PUT",headers:{Authorization:`Bearer ${n}`,"Content-Type":"application/json"},body:JSON.stringify({title:o,author:a,isbn:r})});if(s.ok){const i=await s.json();alert("Book updated successfully");const l=document.getElementById("bookModal");l.style.display="none",S(i)}else throw new Error("Failed to update book")}catch(n){console.error("Error:",n),alert("Failed to update book. Please try again.")}}function S(e){var o;const t=(o=document.querySelector(`button[data-id="${e.id}"]`))==null?void 0:o.closest("tr");t&&(t.innerHTML=`
            <td>${e.title}</td>
            <td>${e.author}</td>
            <td>${e.isbn}</td>
            <td>${e.status}</td>
            <td>
                <button class="update-book-btn" data-id="${e.id}">Update</button>
                <button class="remove-book-btn" data-id="${e.id}">Remove</button>
            </td>
        `,t.querySelector(".update-book-btn").addEventListener("click",()=>c(e.id)),t.querySelector(".remove-book-btn").addEventListener("click",()=>u(e.id)))}async function u(e){if(confirm("Are you sure you want to remove this book?"))try{const t=localStorage.getItem("token");if((await fetch(`${d}/books/${e}`,{method:"DELETE",headers:{Authorization:`Bearer ${t}`}})).ok)alert("Book removed successfully"),A(e);else throw new Error("Failed to remove book")}catch(t){console.error("Error:",t),alert("Failed to remove book. Please try again.")}}function A(e){var o;const t=(o=document.querySelector(`button[data-id="${e}"]`))==null?void 0:o.closest("tr");t&&t.remove()}function T(e){e.innerHTML=`
        <h2>Manage Members</h2>
        <div class="member-list">
            <table class="member-table">
                <thead>
                    <tr>
                        <th>Username</th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody id="memberTableBody"></tbody>
            </table>
        </div>
        <div id="memberModal" class="modal">
            <div class="modal-content">
                <span class="close">&times;</span>
                <div id="memberModalBody"></div>
            </div>
        </div>
    `,m()}async function m(){try{const e=localStorage.getItem("token"),t=await fetch(`${d}/users/`,{headers:{Authorization:`Bearer ${e}`}});if(t.ok){const o=await t.json();F(o)}else throw new Error("Failed to fetch members")}catch(e){console.error("Error:",e),alert("Failed to fetch members. Please try again.")}}function F(e){const t=document.getElementById("memberTableBody");t.innerHTML="",e.forEach(n=>{const s=document.createElement("tr");s.innerHTML=`
            <td>${n.username}</td>
            <td>${n.is_active?"Active":"Deleted"}</td>
            <td>
                <button class="view-details-btn" data-id="${n.id}">View Details</button>
                <button class="update-member-btn" data-id="${n.id}">Update</button>
                <button class="toggle-member-btn" data-id="${n.id}">${n.is_active?"Deactivate":"Activate"}</button>
            </td>
        `,t.appendChild(s)}),document.querySelectorAll(".view-details-btn").forEach(n=>{n.addEventListener("click",s=>{const i=s.target.getAttribute("data-id");D(parseInt(i))})}),document.querySelectorAll(".update-member-btn").forEach(n=>{n.addEventListener("click",s=>{const i=s.target.getAttribute("data-id");q(parseInt(i))})}),document.querySelectorAll(".toggle-member-btn").forEach(n=>{n.addEventListener("click",s=>{const i=s.target.getAttribute("data-id"),l=s.target.textContent==="Activate";U(parseInt(i),l)})})}async function D(e){try{const t=localStorage.getItem("token"),[o,a]=await Promise.all([fetch(`${d}/users/${e}`,{headers:{Authorization:`Bearer ${t}`}}),fetch(`${d}/users/${e}/history`,{headers:{Authorization:`Bearer ${t}`}})]);if(o.ok&&a.ok){const r=await o.json(),n=await a.json();P(r,n)}else throw new Error("Failed to fetch member details or history")}catch(t){console.error("Error:",t),alert("Failed to fetch member details. Please try again.")}}function P(e,t){const o=document.getElementById("memberModal"),a=document.getElementById("memberModalBody");a.innerHTML=`
        <h2>Member Details: ${e.username}</h2>
        <p><strong>Role:</strong> ${e.role}</p>
        <p><strong>Status:</strong> ${e.is_active?"Deleted":"Active"}</p>
        <h3>Borrow History</h3>
        <table class="borrow-history-table">
            <thead>
                <tr>
                    <th>Book Title</th>
                    <th>Borrow Date</th>
                    <th>Return Date</th>
                </tr>
            </thead>
            <tbody>
                ${t.map(n=>`
                    <tr>
                        <td>${n.book_id}</td>
                        <td>${new Date(n.borrowDate).toLocaleDateString()}</td>
                        <td>${n.returnDate?new Date(n.returnDate).toLocaleDateString():"Not returned"}</td>
                    </tr>
                `).join("")}
            </tbody>
        </table>
    `,o.style.display="block";const r=o.querySelector(".close");r.onclick=()=>{o.style.display="none"},window.onclick=n=>{n.target==o&&(o.style.display="none")}}function q(e){const t=document.getElementById("memberModal"),o=document.getElementById("memberModalBody");o.innerHTML=`
        <h2>Update Member</h2>
        <form id="updateMemberForm" class="member-form">
            <input type="text" id="updateUsername" placeholder="Username" required>
            <input type="email" id="updateEmail" placeholder="Email" required>
            <select id="updateRole" required>
                <option value="MEMBER">Member</option>
                <option value="LIBRARIAN">Librarian</option>
            </select>
            <button type="submit">Update Member</button>
        </form>
    `,N(e),document.getElementById("updateMemberForm").addEventListener("submit",n=>R(n,e)),t.style.display="block";const r=t.querySelector(".close");r.onclick=()=>{t.style.display="none"},window.onclick=n=>{n.target==t&&(t.style.display="none")}}async function N(e){try{const t=localStorage.getItem("token"),o=await fetch(`${d}/users/${e}`,{headers:{Authorization:`Bearer ${t}`}});if(o.ok){const a=await o.json();document.getElementById("updateUsername").value=a.username,document.getElementById("updateRole").value=a.role}else throw new Error("Failed to fetch member details")}catch(t){console.error("Error:",t),alert("Failed to fetch member details. Please try again.")}}async function R(e,t){e.preventDefault();const o=document.getElementById("updateUsername").value,a=document.getElementById("updateEmail").value,r=document.getElementById("updateRole").value;try{const n=localStorage.getItem("token");if((await fetch(`${d}/users/${t}`,{method:"PUT",headers:{Authorization:`Bearer ${n}`,"Content-Type":"application/json"},body:JSON.stringify({username:o,email:a,role:r})})).ok){alert("Member updated successfully");const i=document.getElementById("memberModal");i.style.display="none",m()}else throw new Error("Failed to update member")}catch(n){console.error("Error:",n),alert("Failed to update member. Please try again.")}}async function U(e,t){try{const o=localStorage.getItem("token");if((await fetch(`${d}/users/${e}`,{method:"PUT",headers:{Authorization:`Bearer ${o}`,"Content-Type":"application/json"},body:JSON.stringify({isDeleted:!t})})).ok)alert(`Member ${t?"activated":"deactivated"} successfully`),m();else throw new Error(`Failed to ${t?"activate":"deactivate"} member`)}catch(o){console.error("Error:",o),alert(`Failed to ${t?"activate":"deactivate"} member. Please try again.`)}}function H(e){e.innerHTML=`
        <h2>Deleted Members</h2>
        <div class="deleted-members-list">
            <table class="deleted-members-table">
                <thead>
                    <tr>
                        <th>Username</th>
                        <th>Email</th>
                        <th>Role</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody id="deletedMembersTableBody"></tbody>
            </table>
        </div>
    `,p()}async function p(){try{const e=localStorage.getItem("token"),t=await fetch(`${d}/users?isDeleted=true`,{headers:{Authorization:`Bearer ${e}`}});if(t.ok){const o=await t.json();j(o)}else throw new Error("Failed to fetch deleted members")}catch(e){console.error("Error:",e),alert("Failed to fetch deleted members. Please try again.")}}function j(e){const t=document.getElementById("deletedMembersTableBody");t.innerHTML="",e.forEach(a=>{const r=document.createElement("tr");r.innerHTML=`
            <td>${a.username}</td>
            <td>${a.role}</td>
            <td>
                <button class="activate-member-btn" data-id="${a.id}">Activate</button>
            </td>
        `,t.appendChild(r)}),document.querySelectorAll(".activate-member-btn").forEach(a=>{a.addEventListener("click",r=>{const n=r.target.getAttribute("data-id");C(parseInt(n))})})}async function C(e){try{const t=localStorage.getItem("token");if((await fetch(`${d}/users/${e}`,{method:"PUT",headers:{Authorization:`Bearer ${t}`,"Content-Type":"application/json"},body:JSON.stringify({isDeleted:!1})})).ok)alert("Member activated successfully"),p();else throw new Error("Failed to activate member")}catch(t){console.error("Error:",t),alert("Failed to activate member. Please try again.")}}function O(e){e.innerHTML=`
        <div id="content" class="content">
            <h2>Welcome, Librarian</h2>
            <p>Select an option from the sidebar to get started.</p>
        </div>
    `,document.querySelectorAll(".nav-item").forEach(o=>{o.addEventListener("click",a=>{a.preventDefault();const r=a.target.getAttribute("data-page"),n=document.getElementById("content");switch(r){case"books":k(n);break;case"members":T(n);break;case"deleted-members":H(n);break}})})}function z(e){e.innerHTML=`
        <div id="content" class="content">
            <h2>Welcome, Member</h2>
            <p>Select an option from the sidebar to get started.</p>
        </div>
    `,document.querySelectorAll(".nav-item").forEach(o=>{o.addEventListener("click",a=>{switch(a.preventDefault(),a.target.getAttribute("data-page")){case"available-books":x(e);break;case"borrowed-books":console.log("In work");break;case"history":console.log("In work");break}})})}function x(e){e.innerHTML=`
        <div class="content">
            <h2>Available Books</h2>
            <div id="bookList" class="book-list"></div>
        </div>
    `,h()}async function h(){try{const e=localStorage.getItem("token"),t=await fetch(`${d}/books`,{headers:{Authorization:`Bearer ${e}`}});if(t.ok){const o=await t.json();J(o.filter(a=>a.status==="AVAILABLE"))}else throw new Error("Failed to fetch books")}catch(e){console.error("Error:",e),alert("Failed to fetch books. Please try again.")}}function J(e){const t=document.getElementById("bookList");t.innerHTML="",e.forEach(a=>{const r=document.createElement("div");r.className="book-card",r.innerHTML=`
            <h3>${a.title}</h3>
            <p>Author: ${a.author}</p>
            <p>ISBN: ${a.isbn}</p>
            <button class="borrow-book-btn" data-id="${a.id}">Borrow</button>
        `,t.appendChild(r)}),document.querySelectorAll(".borrow-book-btn").forEach(a=>{a.addEventListener("click",r=>{const n=r.target.getAttribute("data-id");_(parseInt(n))})})}async function _(e){try{const t=localStorage.getItem("token");if((await fetch(`${d}/books/${e}/borrow`,{method:"POST",headers:{Authorization:`Bearer ${t}`}})).ok)alert("Book borrowed successfully"),h();else throw new Error("Failed to borrow book")}catch(t){console.error("Error:",t),alert("Failed to borrow book. Please try again.")}}function V(e,t){e.innerHTML=`
        <div class="dashboard-container">
            <div id="sidebar" class="sidebar"></div>
            <div id="main-content" class="main-content"></div>
        </div>
    `;const o=document.getElementById("sidebar"),a=document.getElementById("main-content");y(o,t),t.role==="LIBRARIAN"?O(a):z(a)}function W(e){e.innerHTML=`
        <div class="container">
            <div class="card">
                <h1 class="title">Library Management System</h1>
                <div id="loginForm" class="form">
                    <h2>Login</h2>
                    <input type="text" id="loginUsername" placeholder="Username" required>
                    <input type="password" id="loginPassword" placeholder="Password" required>
                    <button id="loginButton">Login</button>
                    <p>Don't have an account? <a href="#" id="showSignup">Sign up</a></p>
                </div>
                <div id="signupForm" class="form hidden">
                    <h2>Sign Up</h2>
                    <input type="text" id="signupUsername" placeholder="Username" required>
                    <input type="password" id="signupPassword" placeholder="Password" required>
                    <select id="signupRole">
                        <option value="MEMBER">Member</option>
                        <option value="LIBRARIAN">Librarian</option>
                    </select>
                    <button id="signupButton">Sign Up</button>
                    <p>Already have an account? <a href="#" id="showLogin">Login</a></p>
                </div>
            </div>
        </div>
    `;const t=document.getElementById("loginForm"),o=document.getElementById("signupForm"),a=document.getElementById("showSignup"),r=document.getElementById("showLogin"),n=document.getElementById("loginButton"),s=document.getElementById("signupButton");a.addEventListener("click",i=>{i.preventDefault(),t.classList.add("hidden"),o.classList.remove("hidden")}),r.addEventListener("click",i=>{i.preventDefault(),o.classList.add("hidden"),t.classList.remove("hidden")}),n.addEventListener("click",K),s.addEventListener("click",G)}async function K(){const e=document.getElementById("loginUsername").value,t=document.getElementById("loginPassword").value;try{const o=await fetch(`${d}/auth/login`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({username:e,password:t})}),a=await o.json();o.ok?(localStorage.setItem("token",a.token),localStorage.setItem("user",JSON.stringify(a.user)),window.location.reload()):alert(a.error||"Login failed")}catch(o){console.error("Error:",o),alert("An error occurred. Please try again.")}}async function G(){const e=document.getElementById("signupUsername").value,t=document.getElementById("signupPassword").value,o=document.getElementById("signupRole").value;try{const a=await fetch(`${d}/auth/signup`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({username:e,password:t,role:o})}),r=await a.json();a.ok?(localStorage.setItem("token",r.token),localStorage.setItem("user",JSON.stringify(r.user)),window.location.reload()):alert(r.error||"Signup failed")}catch(a){console.error("Error:",a),alert("An error occurred. Please try again.")}}const b=document.getElementById("app");function Q(){const e=localStorage.getItem("token"),t=localStorage.getItem("user"),o=t?JSON.parse(t):null;e&&o?V(b,o):W(b)}Q();
