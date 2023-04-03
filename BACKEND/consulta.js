const { Pool } = require("pg");
const bcrypt = require("bcryptjs");

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  password: "luispost",
  database: "ecommerce",
  allowExitOnIdle: true,
});

const añadirProducto = async ({
  nombre,
  descripcion,
  precio,
  cantidad,
  precio_oferta,
  img_url,
}) => {
  const query = "insert into productos values( DEFAULT, $1,$2,$3,$4,$5,$6)";
  const values = [
    nombre,
    descripcion,
    precio,
    cantidad,
    precio_oferta,
    img_url,
  ];
  await pool.query(query, values);
};

const obtenerProducts = async () => {
  const query = " select * from productos";
  const { rows: productos } = await pool.query(query);
  return productos;
};

const borrarProducto = async ( nombre ) => {
  const query = "delete from productos where nombre= $1";
  value = [nombre];
  const result = await pool.query(query, value);
  return result;
};

const añadirUsuario = async ({
  nombre,
  email,
  password,
  direccion_de_envio_por_default,
  comuna,
  telefono,
}) => {
  const passwordEncryptada = bcrypt.hashSync(password);
  password = passwordEncryptada;
  const query = "INSERT INTO usuarios VALUES (DEFAULT, $1, $2, $3, $4, $5, $6)";
  const values = [
    nombre,
    email,
    passwordEncryptada,
    direccion_de_envio_por_default,
    comuna,
    telefono,
  ];
  await pool.query(query, values);
};

const verificarCredenciales = async ({ email, password }) => {
  const values = [email];
  const consulta = "select * from usuarios where email = $1";
  const {
    rows: [usuario],
    rowCount,
  } = await pool.query(consulta, values);
  const { password: passwordEncryptada } = usuario;
  const passwordiscorrect = bcrypt.compareSync(password, passwordEncryptada);
  if (!passwordiscorrect || !rowCount)
    throw { code: 401, message: "Email y contraseña o Contraseña Incorrecta" };
};
const obtenerUsuario = async (email) => {
  const values = [email];
  consulta = "Select * from usuarios where email = $1";
  const { rows: usuario } = await pool.query(consulta, values);
  return usuario[0];
};
const mostrarInfo = (usuario) => {
  const info = {
    id: usuario.id,
    nombre: usuario.nombre,
    email: usuario.email,
    direccion_de_envio_por_default: usuario.direccion_de_envio_por_default,
    comuna: usuario.comuna,
    telefono: usuario.telefono,
  };
  return info;
};
const actualizarUsuario = async ({
  id,
  nombre,
  email,
  direccion_de_envio_por_default,
  comuna,
  telefono,
}) => {
  consulta =
    "UPDATE usuarios SET nombre=$2, email=$3, direccion_de_envio_por_default=$4, comuna=$5, telefono=$6 WHERE id=$1";

  values = [
    id,
    nombre,
    email,
    direccion_de_envio_por_default,
    comuna,
    telefono,
  ];
  await pool.query(consulta, values);
};

module.exports = {
  obtenerProducts,
  añadirProducto,
  añadirUsuario,
  verificarCredenciales,
  obtenerUsuario,
  mostrarInfo,
  actualizarUsuario,
  borrarProducto,
};
