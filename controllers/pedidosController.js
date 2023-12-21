const db = require('../config/db');

const handleErrors = (res, message, statusCode = 500) => {
    console.error(message);
    res.status(statusCode).json({ error: message });
};

const getPedidos = (req, res) => {
    const query = "SELECT * FROM PEDIDOS";

    db.query(query, (err, result) => {
        if (err) {
            return handleErrors(res, "Error al traer los pedidos");
        }

        if (result.length > 0) {
            res.json(result);
        } else {
            res.status(401).json({ error: "No hay pedidos" });
        }
    });
};

const createPedidos = (req, res) => {
    const { Id, Medidas, Fencargo, FprobableEntrega, Abono, Estado, IdCliente, IdProductoTerminado } = req.body;

    if (!Id || !Medidas || !Fencargo || !FprobableEntrega || !Abono || !Estado || !IdCliente || !IdProductoTerminado) {
        return handleErrors(res, "Todos los campos son obligatorios", 400);
    }

    const query = "INSERT INTO PEDIDOS (Id, Medidas, Fencargo, FprobableEntrega, Abono, Estado, IdCliente, IdProductoTerminado) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
    const values = [Id, Medidas, Fencargo, FprobableEntrega, Abono, Estado, IdCliente, IdProductoTerminado];

    db.query(query, values, (err, result) => {
        if (err) {
            return handleErrors(res, "Error al crear el pedido");
        }

        res.json({
            tipo: "success",
            mensaje: "Pedido creado exitosamente",
            insertedId: result.insertId,
        });
    });
};

const updatePedidos = (req, res) => {
    const { Id = req.query.Id, Medidas, Fencargo, FprobableEntrega, Abono, Estado, IdCliente, IdProductoTerminado } = req.body;

    const checkQuery = "SELECT * FROM PEDIDOS WHERE Id = ?";
    db.query(checkQuery, [Id], (err, result) => {
        if (err) {
            return handleErrors(res, "Error al verificar la existencia del pedido");
        }

        if (result.length === 0) {
            return handleErrors(res, `No se encontró el pedido con el ID ${Id}`, 404);
        }

        const updateQuery = "UPDATE PEDIDOS SET Medidas = ?, Fencargo = ?, FprobableEntrega = ?, Abono = ?, Estado = ?, IdCliente = ?, IdProductoTerminado = ? WHERE Id = ?";
        const updateValues = [Medidas, Fencargo, FprobableEntrega, Abono, Estado, IdCliente, IdProductoTerminado, Id];

        db.query(updateQuery, updateValues, (err, result) => {
            if (err) {
                return handleErrors(res, "Error al actualizar el pedido");
            }

            if (result.affectedRows === 0) {
                return handleErrors(res, `No se encontró el pedido con el ID ${Id} para actualizar`, 404);
            }

            res.json({
                tipo: "success",
                mensaje: "Pedido actualizado exitosamente",
            });
        });
    });
};

const deletePedidos = (req, res) => {
    const Id = req.query.Id;

    const query = "DELETE FROM PEDIDOS WHERE Id = ?";
    const values = Id;

    db.query(query, values, (err, result) => {
        if (err) {
            return handleErrors(res, "Error al eliminar el pedido");
        }

        if (result.affectedRows === 0) {
            return handleErrors(res, `No se encontró el pedido con el ID ${Id} para eliminar`, 404);
        }

        res.json({
            tipo: "success",
            mensaje: "Pedido eliminado exitosamente",
        });
    });
};

const productosEncargadosNoEntregadosPorCliente = async (req, res) => {
    try {
        const query = `
            SELECT
                C.Id AS IdCliente,
                C.Nombre AS NombreCliente,
                P.Id AS IdProducto,
                P.Descripcion AS DescripcionProducto,
                P.PrecioVenta,
                PE.Medidas,
                PE.Estado
            FROM
                CLIENTES C
            JOIN
                PEDIDOS PE ON C.Id = PE.IdCliente
            JOIN
                PRODUCTOS_TERMINADOS P ON PE.IdProductoTerminado = P.Id
            WHERE
                PE.Estado = 'En proceso'
            ORDER BY
                C.Id, P.Id;
        `;

        const result = await db.promise().query(query);

        res.json(result[0]);
    } catch (error) {
        console.error("Error al obtener los productos encargados no entregados por cliente", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
};

module.exports = {
    productosEncargadosNoEntregadosPorCliente,
    getPedidos,
    createPedidos,
    updatePedidos,
    deletePedidos,
};
