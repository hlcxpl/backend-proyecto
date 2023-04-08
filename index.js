const express = require("express");
const app = express();
const cors = require("cors");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const { reportarConsulta } = require("./middlewares/reporte_consulta");
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

const PORT = process.env.PORT;

app.listen(PORT || 3000, () => console.log("SERVER ON IN PORT:", PORT));

const corsOptions = {
  origin: `*`,
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));

app.use(
  cors({
    origin: "https://transcendent-truffle-65cd89.netlify.app/",
  })
);

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "*");
  if (req.method === "OPTIONS") {
    res.header("Access-Control-Allow-Methods", "PUT, POST, PATCH, DELETE, GET");
    return res.status(200).json({});
  }
  next();
});

app.get(process.env.API_URL),
  async (req, res) => {
    res.send("SERVER ON", PORT);
  };

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
    const result = await añadirUsuario(usuario);
    if (result) {
      res.status(201).send({ message: "Usuario Registrado con Éxito" });
    }
  } catch (error) {
    res.status(500).send(error);
  }
});

app.post("/login", reportarConsulta, async (req, res) => {
  try {
    const { email } = req.body;
    const usuario = req.body;
    await verificarCredenciales(usuario);
    const token = jwt.sign({ email }, process.env.JWT);
    res.status(203).json({ message: 'Acesso Autorizado', token: token });
  } catch (error) {
    res.status(error.code || 500).send(error);
  }
});

app.get("/usuario", reportarConsulta, async (req, res) => {
  const Authorization = req.header("Authorization");
  const token = Authorization.split("Bearer ")[1];
  jwt.verify(token, process.env.JWT);
  const { email } = jwt.decode(token);
  const usuario = await obtenerUsuario(email);
  const info = await mostrarInfo(usuario);
  res.json(info);
});

app.put("/usuaruio/editar_info/:id", reportarConsulta, async (req, res) => {
  const { id } = req.params;
  const usuario = req.body;
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
