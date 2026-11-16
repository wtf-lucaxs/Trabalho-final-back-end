const express = require("express")
const app = express()
app.use(express.json())
const port = 3000
const db = require("./db")

app.get("/aula", async (req, res) => {
    try {
        const [resultado] = await db.pool.query("SELECT * FROM aula")
        res.status(200).json(resultado)
    } catch (erro) {
        res.status(500).json({ erro: erro.message })
    }
})

app.post("/aula", async (req, res) => {
    try {
        const dados = req.body
        const [resultado] = await db.pool.query(
            "INSERT INTO aula (serie, turma, componente, professor) VALUES (?, ?, ?, ?)",
            [dados.serie, dados.turma, dados.componente, dados.professor]
        )
        res.status(201).json({ resultado: "Aula cadastrada, ID = " + resultado.insertId })
    } catch (erro) {
        res.status(500).json({ erro: erro.message })
    }
})

app.delete("/aula/:id", async (req, res) => {
    try {
        const id = req.params.id
        const [resultado] = await db.pool.query(
            "DELETE FROM aula WHERE id = ?",
            [id]
        )

        if (resultado.affectedRows === 0) {
            return res.status(404).json({ erro: "Aula não encontrada." })
        }

        res.status(200).json({ resultado: "Aula excluída com sucesso!" })
    } catch (erro) {
        if (erro.code === "ER_ROW_IS_REFERENCED_2") {
            return res.status(400).json({
                erro: "Não é possível excluir esta aula pois ela possui horários cadastrados."
            })
        }
        res.status(500).json({ erro: erro.message })
    }
})

app.post("/horario", async (req, res) => {
    try {
        const dados = req.body
        const [resultado] = await db.pool.query(
            "INSERT INTO horario_aula (idaula, dia_semana, ordem) VALUES (?, ?, ?)",
            [dados.idaula, dados.dia_semana, dados.ordem]
        )
        res.status(201).json({ resultado: "Horário cadastrado, ID = " + resultado.insertId })
    } catch (erro) {
        if (erro.code === "ER_NO_REFERENCED_ROW_2") {
            return res.status(400).json({
                erro: "Erro de chave estrangeira: a aula informada (idaula) não existe na tabela aula."
            })
        }
        res.status(500).json({ erro: erro.message })
    }
})

app.get("/horario/:dia", async (req, res) => {
    try {
        const dia = req.params.dia
        const [resultado] = await db.pool.query(
            "SELECT * FROM horario_aula WHERE dia_semana = ?",
            [dia]
        )
        res.status(200).json(resultado)
    } catch (erro) {
        res.status(500).json({ erro: erro.message })
    }
})

app.delete("/horario/:id", async (req, res) => {
    try {
        const id = req.params.id
        const [resultado] = await db.pool.query(
            "DELETE FROM horario_aula WHERE id = ?",
            [id]
        )

        if (resultado.affectedRows === 0) {
            return res.status(404).json({ erro: "Horário não encontrado." })
        }

        res.status(200).json({ resultado: "Horário excluído com sucesso!" })
    } catch (erro) {
        res.status(500).json({ erro: erro.message })
    }
})

app.listen(port, () => {
    console.log("API rodando na porta " + port)
})
