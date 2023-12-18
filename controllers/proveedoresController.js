const db = require('../config/db');

const handleErrors = (res, message, statusCode = 500) => {
    console.error(message);
    res.status(statusCode).json({ error: message });
};

const getProveedores = (req, res) => {
    const query = "SELECT * FROM proveedores";

    db.query(query, (err, result) => {
        if (err) {
            return handleErrors(res, "Error al traer los proveedores");
        }

        if (result.length > 0) {
            res.json(result);
        } else {
            res.status(401).json({ error: "No hay proveedores" });
        }
    });
};

const createProveedor = (req, res) => {
    const { Nit, Nombre, Dirección, Telefono, NombreContacto } = req.body;
    console.log(req.body);
    if (!Nit || !Nombre || !Dirección || !Telefono || !NombreContacto) {
        return handleErrors(res, "Todos los campos son obligatorios", 400);
    }

    const query = "INSERT INTO PROVEEDORES (Nit, Nombre, Dirección, Telefono, NombreContacto) VALUES (?, ?, ?, ?, ?)";
    const values = [Nit, Nombre, Dirección, Telefono, NombreContacto];

    db.query(query, values, (err, result) => {
        if (err) {
            return handleErrors(res, "Error al crear el proveedor " + err.message);
        }

        res.json({
            tipo: "success",
            mensaje: "Proveedor creado exitosamente",
            insertedId: result.insertId,
        });
    });
};

const updateProveedor = (req, res) => {
    const { Nit = req.query.Nit, Nombre, Dirección, Telefono, NombreContacto } = req.body;

    const checkQuery = "SELECT * FROM PROVEEDORES WHERE Nit = ?";
    db.query(checkQuery, [Nit], (err, result) => {
        if (err) {
            return handleErrors(res, "Error al verificar la existencia del proveedor");
        }

        if (result.length === 0) {
            return handleErrors(res, `No se encontró el proveedor con el Nit ${Nit}`, 404);
        }

        const updateQuery = "UPDATE PROVEEDORES SET Nombre = ?, Dirección = ?, Telefono = ?, NombreContacto = ? WHERE Nit = ?";
        const updateValues = [Nombre, Dirección, Telefono, NombreContacto, Nit];

        db.query(updateQuery, updateValues, (err, result) => {
            if (err) {
                return handleErrors(res, "Error al actualizar el proveedor");
            }

            if (result.affectedRows === 0) {
                return handleErrors(res, `No se encontró el proveedor con el Nit ${Nit} para actualizar`, 404);
            }

            res.json({
                tipo: "success",
                mensaje: "Proveedor actualizado exitosamente",
            });
        });
    });
};

const deleteProveedor = (req, res) => {
    const Nit = req.query.Nit;

    const query = "DELETE FROM PROVEEDORES WHERE Nit = ?";
    const values = Nit;

    db.query(query, values, (err, result) => {
        if (err) {
            return handleErrors(res, "Error al eliminar el proveedor");
        }

        if (result.affectedRows === 0) {
            return handleErrors(res, `No se encontró el proveedor con el Nit ${Nit} para eliminar`, 404);
        }

        res.json({
            tipo: "success",
            mensaje: "Proveedor eliminado exitosamente",
        });
    });
};

module.exports = {
    getProveedores,
    createProveedor,
    updateProveedor,
    deleteProveedor,
};

