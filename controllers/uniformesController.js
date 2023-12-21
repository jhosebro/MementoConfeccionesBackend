const db = require('../config/db');

const obtenerUniformePorColegio = async (req, res) => {
    try {
        const colegioId = req.query.Id;

        const query = `
            SELECT
                Id,
                Nombre,
                Color,
                Tela,
                Bordado,
                LugarBordado,
                Estampado,
                BCMangas,
                BCCuello
            FROM
                UNIFORMES
            WHERE
                IdColegio = ?;
        `;

        const result = await db.promise().query(query, [colegioId]);

        res.json(result[0]);
    } catch (error) {
        console.error("Error al obtener el uniforme por colegio", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
};

const listarColegiosConUniformes = async (req, res) => {
    try {
        const query = `
            SELECT
                COLEGIOS.Id AS IdColegio,
                COLEGIOS.Nombre AS NombreColegio
            FROM
                COLEGIOS
            JOIN
                UNIFORMES ON COLEGIOS.Id = UNIFORMES.IdColegio
            GROUP BY
                COLEGIOS.Id, COLEGIOS.Nombre;
        `;

        const result = await db.promise().query(query);

        res.json(result[0]);
    } catch (error) {
        console.error("Error al listar los colegios con uniformes", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
};

const obtenerTodosUniformes = async (req, res) => {
    try {
        const query = `
            SELECT
                Id,
                Nombre,
                Color,
                Tela,
                Bordado,
                LugarBordado,
                Estampado,
                BCMangas,
                BCCuello
            FROM
                UNIFORMES;
        `;

        const result = await db.promise().query(query);

        res.json(result[0]);
    } catch (error) {
        console.error("Error al obtener todos los uniformes", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
};

const crearUniforme = async (req, res) => {
    try {
        const {
            Nombre,
            Color,
            Tela,
            Bordado,
            LugarBordado,
            Estampado,
            BCMangas,
            BCCuello,
            IdColegio,
        } = req.body;

        const query = `
            INSERT INTO UNIFORMES (Nombre, Color, Tela, Bordado, LugarBordado, Estampado, BCMangas, BCCuello, IdColegio)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?);
        `;

        const values = [
            Nombre,
            Color,
            Tela,
            Bordado,
            LugarBordado,
            Estampado,
            BCMangas,
            BCCuello,
            IdColegio,
        ];

        const result = await db.promise().query(query, values);

        res.json({
            tipo: "success",
            mensaje: "Uniforme creado exitosamente",
            insertedId: result[0].insertId,
        });
    } catch (error) {
        console.error("Error al crear el uniforme", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
};

const actualizarUniforme = async (req, res) => {
    try {
        const uniformeId = req.params.uniformeId;
        const {
            Nombre,
            Color,
            Tela,
            Bordado,
            LugarBordado,
            Estampado,
            BCMangas,
            BCCuello,
        } = req.body;

        const query = `
            UPDATE UNIFORMES
            SET
                Nombre = ?,
                Color = ?,
                Tela = ?,
                Bordado = ?,
                LugarBordado = ?,
                Estampado = ?,
                BCMangas = ?,
                BCCuello = ?
            WHERE
                Id = ?;
        `;

        const values = [
            Nombre,
            Color,
            Tela,
            Bordado,
            LugarBordado,
            Estampado,
            BCMangas,
            BCCuello,
            uniformeId,
        ];

        const result = await db.promise().query(query, values);

        res.json({
            tipo: "success",
            mensaje: "Uniforme actualizado exitosamente",
        });
    } catch (error) {
        console.error("Error al actualizar el uniforme", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
};

const eliminarUniforme = async (req, res) => {
    try {
        const uniformeId = req.params.uniformeId;

        const query = `
            DELETE FROM UNIFORMES
            WHERE Id = ?;
        `;

        const result = await db.promise().query(query, [uniformeId]);

        res.json({
            tipo: "success",
            mensaje: "Uniforme eliminado exitosamente",
        });
    } catch (error) {
        console.error("Error al eliminar el uniforme", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
};

module.exports = {
    listarColegiosConUniformes,
    obtenerUniformePorColegio,
    obtenerTodosUniformes,
    crearUniforme,
    actualizarUniforme,
    eliminarUniforme,
};
