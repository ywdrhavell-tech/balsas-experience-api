# Balsas Experience API

API REST de atrações turísticas de Balsas–MA, construída com Node.js, Express, Prisma ORM e PostgreSQL. Permite listar, filtrar, consultar, cadastrar, atualizar e remover atrações, além de registrar avaliações.

## Equipe
> Preencher antes da entrega: nomes completos, matrículas e contribuições reais de cada integrante.

| Integrante | Matrícula | Contribuição |
|---|---|---|
| [Nome completo 1] | [Matrícula] | [Descrever contribuição real] |
| [Nome completo 2] | [Matrícula] | [Descrever contribuição real] |
| [Adicionar os demais integrantes] | | |

## Tecnologias
- Node.js 20 ou superior — ambiente JavaScript do servidor.
- Express 5 — rotas e tratamento HTTP.
- PostgreSQL — banco de dados relacional.
- Prisma ORM 6 — modelagem, migrações e acesso ao banco.
- dotenv — leitura de variáveis de ambiente.
- cors — configuração de acesso entre origens.

## Pré-requisitos
Node.js 20+, npm e uma instância PostgreSQL local ou hospedada.

## Instalação e configuração
```bash
git clone https://github.com/SEU-USUARIO/balsas-experience-api.git
cd balsas-experience-api
npm install
cp .env.example .env
```
No Windows PowerShell, em vez de `cp`, use `Copy-Item .env.example .env`. Edite `.env` e informe os dados do seu banco. Exemplo fictício, sem senha real:
```env
DATABASE_URL="postgresql://USUARIO:SENHA@HOST:5432/NOME_DO_BANCO?schema=public"
PORT=3000
```
Nunca envie o arquivo `.env` ao GitHub. O `.gitignore` já o exclui.

## Banco de dados
```bash
npx prisma generate
npx prisma migrate dev --name init
npm run db:seed
```
O seed lê `atracoes.json` e cadastra as atrações, categorias e tags no PostgreSQL. Para visualizar o banco:
```bash
npm run db:studio
```

## Executar
```bash
npm run dev
```
A API estará em `http://localhost:3000`. Para iniciar em modo normal: `npm start`.

## Endpoints

| Método | Caminho | Descrição | Status esperado |
|---|---|---|---|
| GET | `/` | Informações da API | 200 |
| GET | `/health` | Verifica se o servidor está ativo | 200 |
| GET | `/atracoes` | Lista atrações | 200 |
| GET | `/atracoes?categoria=Lazer` | Filtra por categoria | 200 |
| GET | `/atracoes?tag=cachoeira` | Filtra por tag | 200 |
| GET | `/atracoes?q=ponte` | Busca pelo nome | 200 |
| GET | `/atracoes/:id` | Busca por ID | 200 ou 404 |
| POST | `/atracoes` | Cria atração | 201 |
| PUT | `/atracoes/:id` | Atualiza atração | 200 ou 404 |
| DELETE | `/atracoes/:id` | Remove atração | 204 ou 404 |
| POST | `/atracoes/:id/avaliacoes` | Registra avaliação de 1 a 5 | 201 ou 400/404 |

### Exemplo de criação
Requisição `POST /atracoes`, com `Content-Type: application/json`:
```json
{
  "nome": "Parque de Exemplo",
  "descricao": "Área de lazer para visitantes.",
  "categoria": "Lazer",
  "localizacao": { "cidade": "Balsas", "estado": "MA" },
  "distanciaCentroKm": 3,
  "tags": ["lazer", "família"]
}
```
Resposta esperada `201 Created` (o `id` e as datas são gerados pelo banco):
```json
{
  "id": 9,
  "nome": "Parque de Exemplo",
  "descricao": "Área de lazer para visitantes.",
  "categoria": "Lazer",
  "localizacao": { "cidade": "Balsas", "estado": "MA" },
  "distanciaCentroKm": 3,
  "tags": ["lazer", "família"],
  "avaliacoes": [],
  "createdAt": "2026-10-17T12:00:00.000Z",
  "updatedAt": "2026-10-17T12:00:00.000Z"
}
```
As datas e o ID acima são ilustrativos; a resposta real depende do banco.

### Exemplo de busca inexistente
`GET /atracoes/99999` → `404 Not Found`
```json
{ "erro": "Atração não encontrada" }
```

### Exemplo de remoção
`DELETE /atracoes/9` → `204 No Content` (sem corpo de resposta).

## Modelo de dados
- **Categoria** (id, nome, createdAt): uma categoria pode possuir várias atrações.
- **Atracao** (id, nome, descricao, cidade, estado, distanciaCentroKm, categoriaId, createdAt, updatedAt): pertence a uma categoria.
- **Tag** (id, nome): rótulo reutilizável.
- **AtracaoTag** (atracaoId, tagId): tabela associativa para relação N:N entre atração e tag.
- **Avaliacao** (id, nota, comentario, autor, atracaoId, createdAt): cada avaliação pertence a uma atração.

As tags ficam em tabela separada porque uma atração pode ter várias tags e uma mesma tag pode ser usada por várias atrações; a tabela de ligação representa essa relação N:N sem armazenar arrays em uma coluna.

## Publicação
A API ainda precisa ser publicada pela equipe. Após publicar, substitua os links abaixo:
- Repositório: `https://github.com/SEU-USUARIO/balsas-experience-api`
- API publicada: `[INSERIR URL DO DEPLOY]`

## Evidências de funcionamento
Adicione em `docs/evidencias/` capturas reais do cliente HTTP mostrando:
1. `GET /atracoes` com status 200;
2. `GET /atracoes/99999` com status 404;
3. `POST /atracoes` com status 201;
4. `DELETE /atracoes/:id` com status 204;
5. URL pública respondendo em `/health`.

Não use capturas simuladas: faça as requisições à API em execução e registre as telas reais.

## Dificuldades e aprendizados
A equipe deve preencher esta seção com as dificuldades que realmente encontrou e como resolveu cada uma. Registre também o que cada integrante aprendeu. Não entregue exemplos inventados como se fossem experiências reais.
