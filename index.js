const express = require("express");
const dotenv = require("dotenv").config();
const db = require("./config/db");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());

const colegiosController = require("./controllers/colegiosController");
const proveedoresController = require("./controllers/proveedoresController");
const materiasPrimasController = require("./controllers/materiasPrimasController");
const productoTerminadoController = require("./controllers/productoTerminadoController");
const clientesController = require("./controllers/clientesController");
const pedidosController = require("./controllers/pedidosController");
const ventasController = require("./controllers/ventasController");
const uniformesController = require("./controllers/uniformesController");

app.get("/colegios", colegiosController.getColegios);
app.get("/colegios/get-next-id", colegiosController.getNextId);
app.post("/colegios", colegiosController.createColegios);
app.put("/colegios", colegiosController.updateColegios);
app.delete("/colegios", colegiosController.deleteColegios);

app.get("/proveedor", proveedoresController.getProveedores);
app.post("/proveedor", proveedoresController.createProveedor);
app.put("/proveedor", proveedoresController.updateProveedor);
app.delete("/proveedor", proveedoresController.deleteProveedor);

app.get("/materiasPrimas", materiasPrimasController.getMateriasPrimas);
app.get("/materiasPrimas/get-next-id", materiasPrimasController.getNextId);
app.post("/materiasPrimas", materiasPrimasController.createMateriaPrima);
app.put("/materiasPrimas", materiasPrimasController.updateMateriaPrima);
app.delete("/materiasPrimas", materiasPrimasController.deleteMateriaPrima);

app.get(
  "/productoTerminado",
  productoTerminadoController.getProductosTerminados
);
app.get(
  "/productosTerminadosCantidadExistencia",
  productoTerminadoController.obtenerExistenciaProductosDescontandoEncargados
);
app.post(
  "/productoTerminado",
  productoTerminadoController.createProductoTerminado
);
app.put(
  "/productoTerminado",
  productoTerminadoController.updateProductoTerminado
);
app.delete(
  "/productoTerminado",
  productoTerminadoController.deleteProductoTerminado
);

app.get("/clientes", clientesController.getClientes);
app.post("/clientes", clientesController.createClientes);
app.put("/clientes", clientesController.updateClientes);
app.delete("/clientes", clientesController.deleteClientes);

app.get("/pedidos", pedidosController.getPedidos);
app.get("/pedidosEncargadosSinEntregar", pedidosController.productosEncargadosNoEntregadosPorCliente);
app.post("/pedidos", pedidosController.createPedidos);
app.put("/pedidos", pedidosController.updatePedidos);
app.delete("/pedidos", pedidosController.deletePedidos);

app.get("/ventas", ventasController.getVentas);
app.get("/ventasTotal", ventasController.getTotalVentas);
app.get(
  "/ventasTotalProductosVendidosColegio",
  ventasController.getTotalProductosVendidosPorColegio
);
app.post("/ventas", ventasController.createVentas);
app.put("/ventas", ventasController.updateVentas);
app.delete("/ventas", ventasController.deleteVentas);

app.get("/uniformes", uniformesController.obtenerTodosUniformes);
app.get("/uniformesColegio", uniformesController.obtenerUniformePorColegio);
app.get(
  "/uniformesListarColegiosConfeccion",
  uniformesController.listarColegiosConUniformes
);
app.post("/uniformes", uniformesController.crearUniforme);
app.put("/uniformes", uniformesController.actualizarUniforme);
app.delete("/uniformes", uniformesController.eliminarUniforme);

app.get("/", (req, res) => {
  res.send("Bienvenido a MementoConfecciones");
});

app.listen(PORT, () => {
  console.log(`La aplicación está escuchando en el puerto ${PORT}`);
});
