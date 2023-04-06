const request = require("supertest");
const app = require("../index");

describe("operaciones Crud ecomerce", () => {
  it("Obteniendo un 200", async () => {
    const response = await request(app).get("/productos").send();
    const status = response.statusCode;
    expect(status).toBe(200);
  });
});

describe("Operaciones CRUD de Productos", () => {
  it("Probando que la ruta POST /admin/agregar_producto agrega un nuevo producto(nose puede por que el valor retornado viene con id serial) y el producto ya este repetido envio de codio status 400", async () => {
    const producto = {
      nombre: "zapatillas",
      descripcion: "zapatillas deportivas",
      precio: 100000,
    };

    const response = await request(app)
      .post("/admin/agregar_producto")
      .send(producto);
    expect(response.status).toBe(400);
  });

  it("Probando envio de codigo 201", async () => {
    const producto = {
      nombre: "balon",
      descripcion: "balon de bascket",
      precio: 85000,
    };
    const response = await request(app)
      .post("/admin/agregar_producto")
      .send(producto);
    const status = response.statusCode;
    expect(status).toBe(201);
  });

  it("Borrando un producto y obtener un codigo 202 al hacerlo", async () => {
    const producto = {
      nombre: "balon",
    };
    const response = await request(app)
      .delete("/admin/agregar_producto")
      .send(producto);
    const status = response.statusCode;
    expect(status).toBe(202);
  });
});
