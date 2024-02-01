import express from 'express'
import bcrypt, { hash } from 'bcrypt'
import 'dotenv/config'
import { initializeApp } from "firebase/app";
import { collection, deleteDoc, doc, getDoc, getDocs, getFirestore, setDoc } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: process.env.apiKey,
    authDomain: "crud-jacg.firebaseapp.com",
    projectId: "crud-jacg",
    storageBucket: "crud-jacg.appspot.com",
    messagingSenderId: "365582993742",
    appId: "1:365582993742:web:b193b26ebdab48b4fd761f"
  };

  // Initialize Firebase
const firebase = initializeApp(firebaseConfig);
const db = getFirestore()
const app = express()
app.use(express.json())

app.get('/', (req, res) => {
    res.send('Respuesta de Raíz')
})

app.post('/signup', (req, res) => {
    const { nombre, Apaterno, Amaterno, telefono, usuario, password } = req.body
    //console.log('@@ body => ', req.body)
    if (nombre.length < 3){
        res.json({'alerta': 'El nombre debe de tener mínimo 3 letras'})
    }else if (!Apaterno.length){
        res.json({ 'alerta': 'El Apaterno no puede ser vacío' })
    }else if (!usuario.length){
        res.json({ 'alerta': 'El Usuario no puede ser vacío' })
    }else if (password.length < 6){
        res.json({ 'alerta': 'La contraseña requiere 6 caracteres' })
    }else {
        const usuarios = collection(db, 'usuarios')
        getDoc(doc(usuarios, usuario)).then(user => {
            if (user.exists()) {
                res.json({ 'alerta': 'Usuario ya existe' })
            } else {
                bcrypt.genSalt(10, (err, salt) => {
                    bcrypt.hash(password, salt, (err, hash) => {
                        req.body.password = hash
                        setDoc(doc(usuarios, usuario), req.body)
                            .then(registered => {
                                res.json({
                                    'alert': 'success',
                                    registered
                                })
                            })
                    })
                })
            }
        })
    }
})

app.post('/login', (req, res) => {
    const { usuario, password } = req.body
    if (!usuario.length || !password.length) {
        return res.json({
            'alerta': 'Algunos campos están vacios'
        })
    }
    const usuarios = collection(db, 'usuarios')
    getDoc(doc(usuarios, usuario))
        .then(user => {
            if (!user.exists()) {
                res.json({
                    'alerta': 'El usuario no existe'
                })
            }else {
                bcrypt.compare(password, user.data().password, (err, result) => {
                    if (result) {
                        let userFound = user.data()
                        res.json({
                            'alert': 'success',
                            'usuario': {
                                'nombre': userFound.nombre,
                                'Apaterno': userFound.Apaterno,
                                'Amaterno': userFound.Amaterno,
                                'usuario': userFound.usuario,
                                'telefono': userFound.telefono
                            }
                        })
                    }else {
                        res.json({
                            'alerta': 'contraseñas no coinciden'
                        })
                    }
                })
            }
        })
})

app.get('/get-all', async (req, res) => {
    const usuarios = collection(db, 'usuarios')
    const docsUsuarios = await getDocs(usuarios)
    const arrUsuarios = []

    docsUsuarios.forEach((usuario) => {
        const obj = {
            nombre: usuario.data().nombre,
            Apaterno: usuario.data().Apaterno,
            Amaterno: usuario.data().Amaterno,
            usuario: usuario.data().usuario,
            telefono: usuario.data().telefono
        }
        arrUsuarios.push(obj)
    })
    if (arrUsuarios.length > 0) {
        res.json({
            'alerta': 'success',
            'data': arrUsuarios
        })
    }else {
        res.json({
            'alerta': 'error',
            'message': 'No hay ususarios en la base de datos'
        })
    }
})

app.post('/delete-user', (req, res) => {
    const { usuario } = req.body
    deleteDoc(doc(collection(db, 'usuarios'), usuario))
    .then(data => {
        console.log(data)
        if (data)
        {
            res.json({
                'alerta': 'Usuario fue borrado'
            })
        } else {
            res.json({
                'alerta': 'El usuario no existe en la base de datos'
            })
        }
    }).catch(err => {
        res.json({
            'alerta': 'Fallo',
            'message': err
        })
    })

})

const port = process.env.PORT || 6000

app.listen(port, () => {
    console.log('Servidor Escuchando: ', port)
})