const db = require('../config/db');

const handleErrors = (res, message, statusCode = 500) => {
    console.error(message);
    res.status(statusCode).json({ error: message });
};

const getProductosTerminados = (req, res) => {
    const query = "SELECT * FROM PRODUCTOS_TERMINADOS";

    db.query(query, (err, result) => {
        if (err) {
            return handleErrors(res, "Error al traer los productos terminados");
        }

        if (result.length > 0) {
            res.json(result);
        } else {
            res.status(401).json({ error: "No hay productos terminados" });
        }
    });
};

const createProductoTerminado = (req, res) => {
    const { Id, Descripcion, Talla, Sexo, PrecioVenta, Existencia, IdUniformes } = req.body;

    if (!Id || !Descripcion || !Talla || !Sexo || !PrecioVenta || !Existencia || !IdUniformes) {
        return handleErrors(res, "Todos los campos son obligatorios", 400);
    }

    const query = "INSERT INTO PRODUCTOS_TERMINADOS (Id, Descripcion, Talla, Sexo, PrecioVenta, Existencia, IdUniformes) VALUES (?, ?, ?, ?, ?, ?, ?)";
    const values = [Id, Descripcion, Talla, Sexo, PrecioVenta, Existencia, IdUniformes];

    db.query(query, values, (err, result) => {
        if (err) {
            return handleErrors(res, "Error al crear el producto terminado " + err.message);
        }

        res.json({
            tipo: "success",
            mensaje: "Producto terminado creado exitosamente",
            insertedId: result.insertId,
        });
    });
};

const updateProductoTerminado = (req, res) => {
    const { Id = req.query.Id, Descripcion, Talla, Sexo, PrecioVenta, Existencia, IdUniformes } = req.body;

    const checkQuery = "SELECT * FROM PRODUCTOS_TERMINADOS WHERE Id = ?";
    db.query(checkQuery, [Id], (err, result) => {
        if (err) {
            return handleErrors(res, "Error al verificar la existencia del producto terminado");
        }

        if (result.length === 0) {
            return handleErrors(res, `No se encontró el producto terminado con el ID ${Id}`, 404);
        }

        const updateQuery = "UPDATE PRODUCTOS_TERMINADOS SET Descripcion = ?, Talla = ?, Sexo = ?, PrecioVenta = ?, Existencia = ?, IdUniformes = ? WHERE Id = ?";
        const updateValues = [Descripcion, Talla, Sexo, PrecioVenta, Existencia, IdUniformes, Id];

        db.query(updateQuery, updateValues, (err, result) => {
            if (err) {
                return handleErrors(res, "Error al actualizar el producto terminado");
            }

            if (result.affectedRows === 0) {
                return handleErrors(res, `No se encontró el producto terminado con el ID ${Id} para actualizar`, 404);
            }

            res.json({
                tipo: "success",
                mensaje: "Producto terminado actualizado exitosamente",
            });
        });
    });
};

const deleteProductoTerminado = (req, res) => {
    const Id = req.query.Id;

    const query = "DELETE FROM PRODUCTOS_TERMINADOS WHERE Id = ?";
    const values = Id;

    db.query(query, values, (err, result) => {
        if (err) {
            return handleErrors(res, "Error al eliminar el producto terminado");
        }

        if (result.affectedRows === 0) {
            return handleErrors(res, `No se encontró el producto terminado con el ID ${Id} para eliminar`, 404);
        }

        res.json({
            tipo: "success",
            mensaje: "Producto terminado eliminado exitosamente",
        });
    });
};

const obtenerExistenciaProductosDescontandoEncargados = async (req, res) => {
    try {
        const query = `
            SELECT
                PT.Id AS IdProducto,
                PT.Descripcion AS DescripcionProducto,
                PT.PrecioVenta,
                PT.Existencia - IFNULL(SUM(P.IdCliente), 0) AS ExistenciaDisponible
            FROM
                PRODUCTOS_TERMINADOS PT
            LEFT JOIN
                PEDIDOS P ON PT.Id = P.IdProductoTerminado AND P.Estado = 'En proceso'
            GROUP BY
                PT.Id, PT.Descripcion, PT.PrecioVenta, PT.Existencia;
        `;

        console.log("Consulta SQL:", query); // Imprimimos la consulta

        const result = await db.promise().query(query);

        res.json(result[0]);
    } catch (error) {
        console.error("Error al obtener la existencia de productos descontando los encargados", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
};


module.exports = {
    obtenerExistenciaProductosDescontandoEncargados,
    getProductosTerminados,
    createProductoTerminado,
    updateProductoTerminado,
    deleteProductoTerminado,
};
