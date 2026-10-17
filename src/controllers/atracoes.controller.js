import prisma from "../db.js";

const include = {
  categoria: true,
  tags: { include: { tag: true } },
  avaliacoes: true
};

function formatar(a) {
  if (!a) return a;
  return {
    id: a.id, nome: a.nome, descricao: a.descricao,
    categoria: a.categoria?.nome,
    localizacao: { cidade: a.cidade, estado: a.estado },
    distanciaCentroKm: a.distanciaCentroKm,
    tags: a.tags?.map(x => x.tag.nome) ?? [],
    avaliacoes: a.avaliacoes ?? [],
    createdAt: a.createdAt, updatedAt: a.updatedAt
  };
}
function validarPayload(body, parcial=false) {
  if (!parcial && (!body.nome || !body.descricao || !body.categoria)) {
    const e = new Error("Os campos nome, descricao e categoria são obrigatórios."); e.status=400; throw e;
  }
  if (body.nome !== undefined && typeof body.nome !== "string") {
    const e = new Error("nome deve ser texto."); e.status=400; throw e;
  }
  if (body.tags !== undefined && !Array.isArray(body.tags)) {
    const e = new Error("tags deve ser uma lista de textos."); e.status=400; throw e;
  }
}
async function categoriaIdPorNome(nome) {
  const c = await prisma.categoria.upsert({ where: { nome }, update: {}, create: { nome } });
  return c.id;
}
async function tagsConnect(tags=[]) {
  return Promise.all(tags.map(async nome => {
    const tag = await prisma.tag.upsert({ where: { nome }, update: {}, create: { nome } });
    return { tag: { connect: { id: tag.id } } };
  }));
}
export async function listar(req,res,next) {
  try {
    const where = {};
    if (req.query.categoria) where.categoria = { nome: { equals: String(req.query.categoria), mode: "insensitive" } };
    if (req.query.tag) where.tags = { some: { tag: { nome: { equals: String(req.query.tag), mode: "insensitive" } } } };
    if (req.query.q) where.nome = { contains: String(req.query.q), mode: "insensitive" };
    const rows = await prisma.atracao.findMany({ where, include, orderBy: { nome: "asc" } });
    res.status(200).json(rows.map(formatar));
  } catch(e) { next(e); }
}
export async function buscarPorId(req,res,next) {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id < 1) return res.status(404).json({ erro: "Atração não encontrada" });
    const row = await prisma.atracao.findUnique({ where: { id }, include });
    if (!row) return res.status(404).json({ erro: "Atração não encontrada" });
    res.status(200).json(formatar(row));
  } catch(e) { next(e); }
}
export async function criar(req,res,next) {
  try {
    validarPayload(req.body);
    const { nome, descricao, categoria, tags=[], localizacao={}, distanciaCentroKm=null } = req.body;
    if (distanciaCentroKm !== null && (typeof distanciaCentroKm !== "number" || distanciaCentroKm < 0))
      return res.status(400).json({ erro: "distanciaCentroKm deve ser um número positivo ou null." });
    const categoriaId = await categoriaIdPorNome(categoria);
    const row = await prisma.atracao.create({
      data: { nome, descricao, cidade: localizacao.cidade || "Balsas", estado: localizacao.estado || "MA",
        distanciaCentroKm, categoriaId, tags: { create: await tagsConnect(tags) } }, include
    });
    res.status(201).json(formatar(row));
  } catch(e) { next(e); }
}
export async function atualizar(req,res,next) {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id < 1) return res.status(404).json({ erro: "Atração não encontrada" });
    validarPayload(req.body,true);
    const existente = await prisma.atracao.findUnique({ where: { id } });
    if (!existente) return res.status(404).json({ erro: "Atração não encontrada" });
    const data = {};
    for (const k of ["nome","descricao","distanciaCentroKm"]) if (req.body[k] !== undefined) data[k]=req.body[k];
    if (req.body.localizacao?.cidade) data.cidade=req.body.localizacao.cidade;
    if (req.body.localizacao?.estado) data.estado=req.body.localizacao.estado;
    if (req.body.categoria) data.categoriaId=await categoriaIdPorNome(req.body.categoria);
    if (req.body.tags) {
      data.tags={ deleteMany: {}, create: await tagsConnect(req.body.tags) };
    }
    const row = await prisma.atracao.update({ where: { id }, data, include });
    res.status(200).json(formatar(row));
  } catch(e) { next(e); }
}
export async function remover(req,res,next) {
  try {
    const id=Number(req.params.id);
    if (!Number.isInteger(id) || id < 1) return res.status(404).json({ erro: "Atração não encontrada" });
    const existe=await prisma.atracao.findUnique({ where:{id} });
    if (!existe) return res.status(404).json({ erro:"Atração não encontrada" });
    await prisma.atracao.delete({ where:{id} });
    res.status(204).end();
  } catch(e) { next(e); }
}
export async function avaliar(req,res,next) {
  try {
    const id=Number(req.params.id), { nota, comentario, autor }=req.body;
    if (!Number.isInteger(nota) || nota < 1 || nota > 5)
      return res.status(400).json({ erro:"nota deve ser um número inteiro de 1 a 5." });
    if (!await prisma.atracao.findUnique({ where:{id} }))
      return res.status(404).json({ erro:"Atração não encontrada" });
    const row=await prisma.avaliacao.create({ data:{ nota, comentario, autor, atracaoId:id } });
    res.status(201).json(row);
  } catch(e) { next(e); }
}
