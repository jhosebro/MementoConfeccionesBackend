const db = require("../config/db");

const handleErrors = (res, message, statusCode = 500) => {
  console.error(message);
  res.status(statusCode).json({ error: message });
};

const getVentas = (req, res) => {
  const query = "SELECT * FROM VENTAS";

  db.query(query, (err, result) => {
    if (err) {
      return handleErrors(res, "Error al traer las ventas");
    }

    if (result.length > 0) {
      res.json(result);
    } else {
      res.status(401).json({ error: "No hay ventas" });
    }
  });
};

const createVentas = (req, res) => {
  const { Id, Nombre, FVenta, IdPedido } = req.body;

  if (!Id || !Nombre || !FVenta || !IdPedido) {
    return handleErrors(res, "Todos los campos son obligatorios", 400);
  }

  const query =
    "INSERT INTO VENTAS (Id, Nombre, FVenta, IdPedido) VALUES (?, ?, ?, ?)";
  const values = [Id, Nombre, FVenta, IdPedido];

  db.query(query, values, (err, result) => {
    if (err) {
      return handleErrors(res, "Error al crear la venta");
    }

    res.json({
      tipo: "success",
      mensaje: "Venta creada exitosamente",
      insertedId: result.insertId,
    });
  });
};

const updateVentas = (req, res) => {
  const { Id = req.query.Id, Nombre, FVenta, IdPedido } = req.body;

  const checkQuery = "SELECT * FROM VENTAS WHERE Id = ?";
  db.query(checkQuery, [Id], (err, result) => {
    if (err) {
      return handleErrors(res, "Error al verificar la existencia de la venta");
    }

    if (result.length === 0) {
      return handleErrors(res, `No se encontró la venta con el ID ${Id}`, 404);
    }

    const updateQuery =
      "UPDATE VENTAS SET Nombre = ?, FVenta = ?, IdPedido = ? WHERE Id = ?";
    const updateValues = [Nombre, FVenta, IdPedido, Id];

    db.query(updateQuery, updateValues, (err, result) => {
      if (err) {
        return handleErrors(res, "Error al actualizar la venta");
      }

      if (result.affectedRows === 0) {
        return handleErrors(
          res,
          `No se encontró la venta con el ID ${Id} para actualizar`,
          404
        );
      }

      res.json({
        tipo: "success",
        mensaje: "Venta actualizada exitosamente",
      });
    });
  });
};

const deleteVentas = (req, res) => {
  const Id = req.query.Id;

  const query = "DELETE FROM VENTAS WHERE Id = ?";
  const values = Id;

  db.query(query, values, (err, result) => {
    if (err) {
      return handleErrors(res, "Error al eliminar la venta");
    }

    if (result.affectedRows === 0) {
      return handleErrors(
        res,
        `No se encontró la venta con el ID ${Id} para eliminar`,
        404
      );
    }

    res.json({
      tipo: "success",
      mensaje: "Venta eliminada exitosamente",
    });
  });
};

const getTotalVentas = (req, res) => {
  const query = "SELECT SUM(Abono) as TotalVentas FROM PEDIDOS";

  db.query(query, (err, result) => {
    if (err) {
      return handleErrors(res, "Error al calcular el total de ventas");
    }

    const totalVentas = result[0].TotalVentas || 0;
    res.json({ totalVentas });
  });
};

const getTotalProductosVendidosPorColegio = async (req, res) => {
    try {
        const query = `
            SELECT
                COLEGIOS.Nombre AS NombreColegio,
                SUM(PRODUCTOS_TERMINADOS.Existencia) AS TotalProductosVendidos
            FROM
                COLEGIOS
            JOIN
                UNIFORMES ON COLEGIOS.Id = UNIFORMES.IdColegio
            JOIN
                PRODUCTOS_TERMINADOS ON UNIFORMES.Id = PRODUCTOS_TERMINADOS.IdUniformes
            JOIN
                PEDIDOS ON PRODUCTOS_TERMINADOS.Id = PEDIDOS.IdProductoTerminado
            JOIN
                VENTAS ON PEDIDOS.Id = VENTAS.IdPedido
            GROUP BY
                COLEGIOS.Nombre;
        `;

        const result = await db.promise().query(query);

        res.json(result[0]); // El resultado estará en result[0]
    } catch (error) {
        console.error("Error al obtener el total de productos vendidos por colegio", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
};

module.exports = {
  getVentas,
  getTotalVentas,
  getTotalProductosVendidosPorColegio,
  createVentas,
  updateVentas,
  deleteVentas,
};
