const db = require('../config/db');

const handleErrors = (res, message, statusCode = 500) => {
    console.error(message);
    res.status(statusCode).json({ error: message });
};

const getColegios = (req, res) => {
    const query = "SELECT * FROM colegios";

    db.query(query, (err, result) => {
        if (err) {
            return handleErrors(res, "Error al traer los colegios");
        }

        if (result.length > 0) {
            res.json(result);
        } else {
            res.status(401).json({ error: "No hay colegios" });
        }
    });
};

const createColegios = (req, res) => {
    const { Id, Nombre, Dirección, Teléfono } = req.body;

    if (!Id || !Nombre || !Dirección || !Teléfono) {
        return handleErrors(res, "Todos los campos son obligatorios", 400);
    }

    const query = "INSERT INTO COLEGIOS (Id, Nombre, Dirección, Teléfono) VALUES (?, ?, ?, ?)";
    const values = [Id, Nombre, Dirección, Teléfono];

    db.query(query, values, (err, result) => {
        if (err) {
            return handleErrors(res, "Error al crear el colegio");
        }

        res.json({
            tipo: "success",
            mensaje: "Colegio creado exitosamente",
            insertedId: result.insertId,
        });
    });
};

const updateColegios = (req, res) => {
    
    const { Id = req.query.Id, Nombre, Dirección, Teléfono } = req.body;
    

    const checkQuery = "SELECT * FROM COLEGIOS WHERE Id = ?";
    db.query(checkQuery, [Id], (err, result) => {
        if (err) {
            return handleErrors(res, "Error al verificar la existencia del colegio");
        }

        if (result.length === 0) {
            return handleErrors(res, `No se encontró el colegio con el ID ${Id}`, 404);
        }

        const updateQuery = "UPDATE COLEGIOS SET Nombre = ?, Dirección = ?, Teléfono = ? WHERE Id = ?";
        const updateValues = [Nombre, Dirección, Teléfono, Id];

        db.query(updateQuery, updateValues, (err, result) => {
            if (err) {
                return handleErrors(res, "Error al actualizar el colegio");
            }

            if (result.affectedRows === 0) {
                return handleErrors(res, `No se encontró el colegio con el ID ${Id} para actualizar`, 404);
            }

            res.json({
                tipo: "success",
                mensaje: "Colegio actualizado exitosamente",
            });
        });
    });
};

const deleteColegios = (req, res) => {
    const Id = req.query.Id;
    console.log(req.query);

    const query = "DELETE FROM COLEGIOS WHERE Id = ?";
    const values = Id;

    db.query(query, values, (err, result) => {
        if (err) {
            return handleErrors(res, "Error al eliminar el colegio");
        }

        if (result.affectedRows === 0) {
            return handleErrors(res, `No se encontró el colegio con el ID ${Id} para eliminar`, 404);
        }

        res.json({
            tipo: "success",
            mensaje: "Colegio eliminado exitosamente",
        });
    });
};

module.exports = {
    getColegios,
    createColegios,
    updateColegios,
    deleteColegios,
};
