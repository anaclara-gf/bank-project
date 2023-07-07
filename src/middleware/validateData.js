const accountValidation = (req, res, next) => {
  const validAccountTypes = ["CORRENTE", "POUPANÇA"];
  const validBankNames = [
    "ITAÚ",
    "SANTANDER",
    "CAIXA",
    "BANCO DO BRASIL",
    "BRADESCO",
  ];

  if (!validAccountTypes.includes(req.body.tipo_conta.toUpperCase())) {
    return res
      .status(400)
      .send({ erro: `O tipo_conta deve ser Poupança ou Corrente` });
  }

  if (!validBankNames.includes(req.body.nome_banco.toUpperCase())) {
    return res.status(400).send({
      erro: `O nome_banco deve ser Itaú, Santamder, Caixa, Banco do Brasil ou Bradesco`,
    });
  }

  next();
};

module.exports = accountValidation;
