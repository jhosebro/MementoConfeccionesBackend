const db = require('../config/db');

const handleErrors = (res, message, statusCode = 500) => {
    console.error(message);
    res.status(statusCode).json({ error: message });
};

const getMateriasPrimas = (req, res) => {
    const query = "SELECT * FROM MATERIAS_PRIMAS";

    db.query(query, (err, result) => {
        if (err) {
            return handleErrors(res, "Error al traer las materias primas");
        }

        if (result.length > 0) {
            res.json(result);
        } else {
            res.status(401).json({ error: "No hay materias primas" });
        }
    });
};

const getNextId = (req, res) => {
    const query = "SELECT Id FROM materias_primas ORDER BY Id DESC LIMIT 1";

    db.query(query, (err, result) => {
        if (err) {
            // Manejo de errores
            console.error("Error al obtener el ID de la ultima materia prima", err);
            return res.status(500).json({ error: "Error interno del servidor" });
        }

        if (result.length > 0) {
            // Envía el próximo ID como un objeto JSON
            res.json({ nextId: result[0].Id + 1 });
        } else {
            // No hay colegios
            res.status(404).json({ error: "No hay materias primas" });
        }
    });
};

const createMateriaPrima = (req, res) => {
    const { Id, Tipo, Descripcion, Existencia, UnidadMedida, IdProveedor } = req.body;

    if (!Id || !Tipo || !Descripcion || !Existencia || !UnidadMedida || !IdProveedor) {
        return handleErrors(res, "Todos los campos son obligatorios", 400);
    }

    const query = "INSERT INTO MATERIAS_PRIMAS (Id, Tipo, Descripcion, Existencia, UnidadMedida, IdProveedor) VALUES (?, ?, ?, ?, ?, ?)";
    const values = [Id, Tipo, Descripcion, Existencia, UnidadMedida, IdProveedor];

    db.query(query, values, (err, result) => {
        if (err) {
            return handleErrors(res, "Error al crear la materia prima " + err.message);
        }

        res.json({
            tipo: "success",
            mensaje: "Materia prima creada exitosamente",
            insertedId: result.insertId,
        });
    });
};

const updateMateriaPrima = (req, res) => {
    const { Id = req.query.Id, Tipo, Descripcion, Existencia, UnidadMedida, IdProveedor } = req.body;

    const checkQuery = "SELECT * FROM MATERIAS_PRIMAS WHERE Id = ?";
    db.query(checkQuery, [Id], (err, result) => {
        if (err) {
            return handleErrors(res, "Error al verificar la existencia de la materia prima");
        }

        if (result.length === 0) {
            return handleErrors(res, `No se encontró la materia prima con el ID ${Id}`, 404);
        }

        const updateQuery = "UPDATE MATERIAS_PRIMAS SET Tipo = ?, Descripcion = ?, Existencia = ?, UnidadMedida = ?, IdProveedor = ? WHERE Id = ?";
        const updateValues = [Tipo, Descripcion, Existencia, UnidadMedida, IdProveedor, Id];

        db.query(updateQuery, updateValues, (err, result) => {
            if (err) {
                return handleErrors(res, "Error al actualizar la materia prima");
            }

            if (result.affectedRows === 0) {
                return handleErrors(res, `No se encontró la materia prima con el ID ${Id} para actualizar`, 404);
            }

            res.json({
                tipo: "success",
                mensaje: "Materia prima actualizada exitosamente",
            });
        });
    });
};

const deleteMateriaPrima = (req, res) => {
    const Id = req.query.Id;

    const query = "DELETE FROM MATERIAS_PRIMAS WHERE Id = ?";
    const values = Id;

    db.query(query, values, (err, result) => {
        if (err) {
            return handleErrors(res, "Error al eliminar la materia prima");
        }

        if (result.affectedRows === 0) {
            return handleErrors(res, `No se encontró la materia prima con el ID ${Id} para eliminar`, 404);
        }

        res.json({
            tipo: "success",
            mensaje: "Materia prima eliminada exitosamente",
        });
    });
};

module.exports = {
    getMateriasPrimas,
    createMateriaPrima,
    updateMateriaPrima,
    deleteMateriaPrima,
    getNextId
};
