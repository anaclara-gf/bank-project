const express = require("express");
const verifyToken = require("../middleware/verifyToken");
const accountValidation = require("../middleware/validateData");
const axios = require("axios");

const BankInfo = require("../models/bankInfo");

const router = express.Router();

router.get("/accounts", verifyToken, (_, res) => {
  BankInfo.find()
    .then((dados) => {
      res.status(200).send({ resultado: dados });
    })
    .catch((erro) => {
      res.status(400).send({
        erro: `Ocorreu um erro durante o processamento da requisição ${erro}`,
      });
    });
});

router.post("/accounts", verifyToken, accountValidation, (req, res) => {
  axios
    .get(`http://127.0.0.1:5000/users/${req.content.id}`)
    .then((response) => {
      BankInfo.find({
        nome_titular: response.data.resultado.nomecompleto,
      }).then((result) => {
        if (result.length) {
          result.map((account) => {
            if (
              account.nome_banco.toUpperCase() ===
                req.body.nome_banco.toUpperCase() &&
              account.tipo_conta.toUpperCase() ===
                req.body.tipo_conta.toUpperCase()
            ) {
              return res.status(400).send({
                erro: "Esse usuário já possui esse tipo de conta nesse banco",
              });
            }
          });
        }
      });

      req.body.nome_titular = response.data.resultado.nomecompleto;
      req.body.limite_cartao = 100;

      const accountData = new BankInfo(req.body);
      accountData
        .save()
        .then(() =>
          res.status(201).send({ message: "Dados cadastrados com sucesso" })
        )
        .catch((erro) =>
          res.status(400).send({ erro: `Erro ao tentar cadastrar ${erro}` })
        );
    })
    .catch((error) => {
      res.status(400).send(`Erro ao encontrar usuário => ${error}`);
    });
});

router.put("/accounts/limit/:id", verifyToken, (req, res) => {
  if (req.body.limite_cartao) {
    typeof req.body.limite_cartao !== "number" &&
      res
        .status(400)
        .send({ erro: "É obrigatório que o limite requirido seja um número" });
    BankInfo.findByIdAndUpdate(
      req.params.id,
      { limite_cartao: req.body.limite_cartao },
      { new: true }
    )
      .then((result) => {
        if (!result) {
          return res.status(400).send({
            erro: "Não foi possível atualizar o limite do cartão",
          });
        }
        res.status(200).send({
          message: `Você atualizou com sucesso o limite do cartão do usuário com id ${req.params.id}!`,
        });
      })
      .catch((error) => {
        res
          .status(500)
          .send({ erro: `Erro ao processar a solicitação: ${error}` });
      });
  } else {
    res
      .status(400)
      .send({ erro: "É obrigatório mandar o parâmetro limite_cartão" });
  }
});

router.use((_, res) => {
  res.type("application/json");
  res.status(404).send("404 - Not Found");
});

module.exports = router;
