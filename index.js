const express = require('express');
const dotenv = require('dotenv').config();
const db = require('./config/db');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

const colegiosController = require('./controllers/colegiosController');
const proveedoresController = require('./controllers/proveedoresController');
const materiasPrimasController = require('./controllers/materiasPrimasController');
const productoTerminadoController = require('./controllers/productoTerminadoController');

app.get('/colegios', colegiosController.getColegios);
app.post('/colegios', colegiosController.createColegios);
app.put('/colegios', colegiosController.updateColegios);
app.delete('/colegios', colegiosController.deleteColegios);

app.get('/proveedor', proveedoresController.getProveedores);
app.post('/proveedor', proveedoresController.createProveedor);
app.put('/proveedor', proveedoresController.updateProveedor);
app.delete('/proveedor', proveedoresController.deleteProveedor);

app.get('/materiasPrimas', materiasPrimasController.getMateriasPrimas);
app.post('/materiasPrimas', materiasPrimasController.createMateriaPrima);
app.put('/materiasPrimas', materiasPrimasController.updateMateriaPrima);
app.delete('/materiasPrimas', materiasPrimasController.deleteMateriaPrima);

app.get('/productoTerminado', productoTerminadoController.getProductosTerminados);
app.post('/productoTerminado', productoTerminadoController.createProductoTerminado);
app.put('/productoTerminado', productoTerminadoController.updateProductoTerminado);
app.delete('/productoTerminado', productoTerminadoController.deleteProductoTerminado);

app.get('/', (req, res) => {
  res.send('Bienvenido a MementoConfecciones');
});

app.listen(PORT, () => {
  console.log(`La aplicación está escuchando en el puerto ${PORT}`);
});
