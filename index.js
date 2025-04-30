import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-app.js"
import { getDatabase, ref, push } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-database.js"
import { getAuth, signInWithPopup, GoogleAuthProvider, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-auth.js"

const firebaseConfig = {
    apiKey: "AIzaSyCzRkXwbnsWdMPQWIhVsanO1QGUKGB7kkQ",
    authDomain: "moody-853e7.firebaseapp.com",
    databaseURL: "https://moody-853e7-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "moody-853e7",
    storageBucket: "moody-853e7.firebasestorage.app",
    messagingSenderId: "524182918989",
    appId: "1:524182918989:web:2f1572076185536c668904"
  };

  const app = initializeApp(firebaseConfig)
  const database = getDatabase(app)
  const groceriesInDB = ref(database, "groceries")
  const auth = getAuth(app)
  const provider = new GoogleAuthProvider()
  
  const inputFieldEl = document.getElementById("input-field")
  const addButtonEl = document.getElementById("add-button")
  const loginButtonEl = document.createElement("button")
  loginButtonEl.textContent = "Sign in with Google"
  const containerEl = document.querySelector(".container")
  containerEl.appendChild(loginButtonEl)
  const logoutButtonEl = document.createElement("button")
  
  
  let user = null
  
  onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
          user = currentUser
          console.log("Logged User:", user.email)
          loginButtonEl.style.display = "none"
          logoutButtonEl.textContent = "Logout"
          containerEl.appendChild(logoutButtonEl)
          addButtonEl.disabled = false 
          inputFieldEl.disabled = false
      } else {
          user = null
          console.log("User logged out")
          loginButtonEl.style.display = "block"
          if (logoutButtonEl.parentNode) {
              logoutButtonEl.remove() 
          }
          addButtonEl.disabled = true 
          inputFieldEl.disabled = true
      }
  })
  
  loginButtonEl.addEventListener("click", function() {
      signInWithPopup(auth, provider)
          .then((result) => {
              const credential = GoogleAuthProvider.credentialFromResult(result)
              const token = credential?.accessToken
              user = result.user
              console.log("Zalogowano jako:", user.email)
          }).catch((error) => {
              const errorCode = error.code
              const errorMessage = error.message
              const email = error.customData?.email
              const credential = GoogleAuthProvider.credentialFromError(error)
              console.error("Błąd logowania:", errorMessage, errorCode)
          })
  })
  
  logoutButtonEl.addEventListener("click", function() {
      signOut(auth).then(() => {
          console.log("Logged out succesfully.")
      }).catch((error) => {
          console.error("Error while logging out:", error)
      })
  })
  
  addButtonEl.addEventListener("click", function() {
      if (user) {
          let inputValue = inputFieldEl.value
          push(groceriesInDB, {
              uid: user.uid,
              item: inputValue
          })
          inputFieldEl.value = ""
          console.log(`${inputValue} added to db by ${user.email}`)
      } else {
          alert("You have to login to add items to the list.")
      }
  })