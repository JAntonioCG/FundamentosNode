const express = require('express')
import { initializeApp } from "firebase/app";
const app = express()
const port = 6010

app.get('/', (req, res) => {
    res.send('Respuesta de Raíz')
})

app.get('/contacto', (req,res) => {
    res.send('Respuesta desde contacto')
})

app.listen(port, () => {
    console.log('Servidor Escuchando: ', port)
    console.log(`Servidor Escuchando: ${port}`)
})

// Import the functions you need from the SDKs you need

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDemZ9PeOBLbcmsp1xCKpQV_Moxn3uUFjg",
  authDomain: "crud-jacg.firebaseapp.com",
  projectId: "crud-jacg",
  storageBucket: "crud-jacg.appspot.com",
  messagingSenderId: "365582993742",
  appId: "1:365582993742:web:b193b26ebdab48b4fd761f"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);