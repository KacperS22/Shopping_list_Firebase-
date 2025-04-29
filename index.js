import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-app.js"
import { getDatabase, ref, push } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-database.js"

const appSettings = {
    databaseURL: "https://moody-853e7-default-rtdb.europe-west1.firebasedatabase.app/"
}

const app = initializeApp(appSettings)
const database = getDatabase(app)
const groceriesInDB = ref(database, "groceries")

const inputFieldEl = document.getElementById("input-field")
const addButtonEl = document.getElementById("add-button")


addButtonEl.addEventListener("click", function() {
    let inputValue = inputFieldEl.value
    
    push(groceriesInDB, inputValue)

    console.log(`${inputValue} added to db`)
})