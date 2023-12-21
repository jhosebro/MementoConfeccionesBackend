const db = require('../config/db');

const handleErrors = (res, message, statusCode = 500) => {
    console.error(message);
    res.status(statusCode).json({ error: message });
};

const getClientes = (req, res) => {
    const query = "SELECT * FROM CLIENTES";

    db.query(query, (err, result) => {
        if (err) {
            return handleErrors(res, "Error al traer los clientes");
        }

        if (result.length > 0) {
            res.json(result);
        } else {
            res.status(401).json({ error: "No hay clientes" });
        }
    });
};

const createClientes = (req, res) => {
    const { Id, Nombre, Telefono } = req.body;

    if (!Id || !Nombre || !Telefono) {
        return handleErrors(res, "Todos los campos son obligatorios", 400);
    }

    const query = "INSERT INTO CLIENTES (Id, Nombre, Telefono) VALUES (?, ?, ?)";
    const values = [Id, Nombre, Telefono];

    db.query(query, values, (err, result) => {
        if (err) {
            return handleErrors(res, "Error al crear el cliente");
        }

        res.json({
            tipo: "success",
            mensaje: "Cliente creado exitosamente",
            insertedId: result.insertId,
        });
    });
};

const updateClientes = (req, res) => {
    const { Id = req.query.Id, Nombre, Telefono } = req.body;

    const checkQuery = "SELECT * FROM CLIENTES WHERE Id = ?";
    db.query(checkQuery, [Id], (err, result) => {
        if (err) {
            return handleErrors(res, "Error al verificar la existencia del cliente");
        }

        if (result.length === 0) {
            return handleErrors(res, `No se encontró el cliente con el ID ${Id}`, 404);
        }

        const updateQuery = "UPDATE CLIENTES SET Nombre = ?, Telefono = ? WHERE Id = ?";
        const updateValues = [Nombre, Telefono, Id];

        db.query(updateQuery, updateValues, (err, result) => {
            if (err) {
                return handleErrors(res, "Error al actualizar el cliente");
            }

            if (result.affectedRows === 0) {
                return handleErrors(res, `No se encontró el cliente con el ID ${Id} para actualizar`, 404);
            }

            res.json({
                tipo: "success",
                mensaje: "Cliente actualizado exitosamente",
            });
        });
    });
};

const deleteClientes = (req, res) => {
    const Id = req.query.Id;

    const query = "DELETE FROM CLIENTES WHERE Id = ?";
    const values = Id;

    db.query(query, values, (err, result) => {
        if (err) {
            return handleErrors(res, "Error al eliminar el cliente");
        }

        if (result.affectedRows === 0) {
            return handleErrors(res, `No se encontró el cliente con el ID ${Id} para eliminar`, 404);
        }

        res.json({
            tipo: "success",
            mensaje: "Cliente eliminado exitosamente",
        });
    });
};

module.exports = {
    getClientes,
    createClientes,
    updateClientes,
    deleteClientes,
};
