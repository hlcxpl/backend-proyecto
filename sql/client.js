var pg = require("pg");
//or native libpq bindings
//var pg = require('pg').native

const { Client } = require("pg");

const client = new Client({
  connectionString:
    "postgres://jpkwhefx:1gseizWAMFQEmBjNbE_bVvpA8tyqMMXi@mahmud.db.elephantsql.com/jpkwhefx",
});

client.connect((err) => {
  if (err) {
    console.error("Error al conectarse a la base de datos", err.stack);
  } else {
    console.log("Conexión a la base de datos exitosa");
  }
});

client.query("SELECT * FROM users", (err, res) => {
  if (err) {
    console.error("Error al ejecutar la consulta", err.stack);
  } else {
    console.log(res.rows);
  }
  client.end();
});
