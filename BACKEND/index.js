const express = require("express");
const app = express();
const cors = require("cors");
const jwt = require("jsonwebtoken");
const { reportarConsulta } = require("./middlewares/reporte_consulta.js");
const {
  añadirProducto,
  obtenerProducts,
  añadirUsuario,
  verificarCredenciales,
  obtenerUsuario,
  mostrarInfo,
  actualizarUsuario,
  borrarProducto,
} = require("./consulta");

app.use(express.json());
app.use(cors());

app.listen(3000, () => console.log("SERVER ON"));

app.get("/productos", async (req, res) => {
  try {
    const productos = await obtenerProducts();
    res.json(productos);
  } catch (e) {
    res.status(500).send(error);
  }
});

app.post("/admin/agregar_producto", async (req, res) => {
  try {
    const productoNuevo = req.body;
    const { nombre } = req.body;
    const productos = await obtenerProducts();
    const existeUnProductoConEseNombre = productos.some(
      (pn) => pn.nombre == nombre
    );
    if (existeUnProductoConEseNombre)
      res.status(400).send({ message: "Ya existe un producto con ese nombre" });
    else {
      await añadirProducto(productoNuevo);
      const productos = await obtenerProducts();
      const productoBuscado = productos.find((p) => p.nombre === nombre);
      res.status(201).send(productoBuscado);
    }
  } catch (error) {
    res.status(500).send(error);
  }
});

app.delete("/admin/agregar_producto/", async (req, res) => {
  try {
    const { nombre } = req.body;
    const result = await borrarProducto(nombre);
    if (result) {
      res.status(202).send({ message: "producto borrado" });
    }
  } catch (error) {
    res.status(500).send(error);
  }
});

app.post("/registrar", async (req, res) => {
  try {
    const usuario = req.body;
    await añadirUsuario(usuario);
    res.send("Usuario Registrado con Éxito");
  } catch (error) {
    res.status(500).send(error);
  }
});

app.post("/login", reportarConsulta, async (req, res) => {
  try {
    const { email } = req.body;
    const usuario = req.body;
    await verificarCredenciales(usuario);
    const token = jwt.sign({ email }, "a-z_A-Z");
    res.send(token);
  } catch (error) {
    res.status(error.code || 500).send(error);
  }
});

app.get("/usuario", reportarConsulta, async (req, res) => {
  const Authorization = req.header("Authorization");
  console.log(Authorization);
  const token = Authorization.split("Bearer ")[1];
  jwt.verify(token, "a-z_A-Z");
  const { email } = jwt.decode(token);
  const usuario = await obtenerUsuario(email);
  const info = await mostrarInfo(usuario);
  res.json(info);
});

app.put("/usuaruio/editar_info/:id", reportarConsulta, async (req, res) => {
  const { id } = req.params;
  const usuario = req.body;
  console.log(usuario);
  await actualizarUsuario(id, usuario);
});

// app.get('/user/pedidos', async (req, res) => {
//     try {
//         const pedidos = await getOrders()
//         res.json(pedidos)
//     } catch (e) {
//         res.status(500).send(e.message)
//     }
// })

// app.get('/producto/:id', async (req, res) => {
//     try {
//         const { id } = req.params
//         const productos = await getProducts(id)
//         res.json(productos)
//         res.send("Obteniendo datos del producto")
//     } catch (e) {
//         res.status(500).send(e.message)
//     }
// })

// app.post('/productos', async (req, res) => {
//     try {
//         const product = req.body
//         await addProduct(product)
//     } catch (e) {
//         res.status(500).send(e.message)
//     }
// })
module.exports = app;
