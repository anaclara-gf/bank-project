# API para cadastro de conta bancária

Essa API foi desenvolvida para cadastrar uma conta bancária a um usuário já criado anteriormente por [essa API](https://github.com/anaclara-gf/auth-project).

Para rodar a aplicação, você deve ter o Docker instalado e um banco de dados MongoDB. Caso você não tenha o Docker na sua máquina, a forma mais fácil é instalar o [Docker Desktop](https://docs.docker.com/desktop/). Para criar um banco de dados MongoDB gratuito, crie uma conta no [site do MongoDB](https://www.mongodb.com/).

Antes de rodar a aplicação, você deve criar um arquivo .env na raíz do projeto com as configurações de porta, do seu banco de dados e sua chave do Json Web Token.

Para rodar a aplicação, primeiro você deve criar uma imagem docker com o comando:

    docker build -t [nomeimagem] .

Substitua o [nomeimagem] pelo que fizer mais sentido para você.

Depois você deve criar um container a partir da imagem que você criou anteriormente. Para isso rode o comando:

    docker run --name [nomecontainer] -p 3000:3000 [nomeimagem]

Substitua o [nomecontainer] pelo que fizer mais sentido para você e o [nomeimagem] pelo nome da imagem que você criou anteriormente.

# Endpoints

Os endpoints da API estão descritos abaixo.

## 1. Criar conta

### Request

`POST /accounts`

Body

    nome_banco: String,
    // Os bancos aceitos são: Itaú, Santamder, Caixa, Banco do Brasil ou Bradesco.
    tipo_conta: String,
    // O tipo de conta deve ser Poupança ou Corrente.

Headers

    token: JWT
    // Esse JWT foi gerado no login da API de cadastro e autenticação de usuários

### Responses

HTTP/1.1 201 CREATED

    {
        "message": "Dados cadastrados com sucesso"
    }

HTTP/1.1 400 BAD REQUEST

    {
        "erro": "Esse usuário já possui esse tipo de conta nesse banco"
    }

HTTP/1.1 400 BAD REQUEST

    {
        "erro": "Erro ao encontrar usuário => [erro]"
    }

HTTP/1.1 400 BAD REQUEST

    {
        "erro": "Erro ao tentar cadastrar [erro]"
    }

HTTP/1.1 400 BAD REQUEST

    {
        "erro": "O tipo_conta deve ser Poupança ou Corrente"
    }

HTTP/1.1 400 BAD REQUEST

    {
        "erro": "O nome_banco deve ser Itaú, Santamder, Caixa, Banco do Brasil ou Bradesco"
    }

## 2. Achar contas

### Request

`GET /accounts`

Headers

    token: JWT
    // Esse JWT foi gerado no login da API de cadastro e autenticação de usuários

### Responses

HTTP/1.1 200 OK

    {
        "resultado": [
             {
                "_id": String,
                "nome_banco": String,
                "tipo_conta": String,
                "nome_titular": String,
                // O nome do titular vai vir de acordo com o token do login
                "limite_cartao": Number,
                // O limite do cartão inicia como 100, mas você pode aumentar depois
                "__v": Number
            }
        ]
    }

HTTP/1.1 400 BAD REQUEST

    {
        "erro": "Ocorreu um erro durante o processamento da requisição [erro]"
    }

## 3. Aumentar limite

### Request

`PUT /accounts/limit/:id`

Headers

    token: JWT

Body

    limite_cartao: Number,

### Responses

HTTP/1.1 200 OK

    {
        "resultado": "Você atualizou com sucesso o limite do cartão do usuário com id [:id]"
    }

HTTP/1.1 400 BAD REQUEST

    {
        "erro": "É obrigatório que o limite requirido seja um número"
    }

HTTP/1.1 400 BAD REQUEST

    {
        "erro": "É obrigatório mandar o parâmetro limite_cartão"
    }

HTTP/1.1 400 BAD REQUEST

    {
        "erro": "Não foi possível atualizar o limite do cartão"
    }

HTTP/1.1 500 INTERNAL SERVER ERROR

    {
        "erro": "Erro ao processar a solicitação: [erro]"
    }
