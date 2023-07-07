const mongoose = require("../database/connection");

const schema = new mongoose.Schema({
  nome_banco: { type: String, required: true },
  tipo_conta: { type: String, required: true },
  nome_titular: { type: String, required: true },
  limite_cartao: { type: Number, required: true },
});

const BankInfo = mongoose.model("bankInfo", schema);
module.exports = BankInfo;
