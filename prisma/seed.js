import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const prisma = new PrismaClient();
const here = path.dirname(fileURLToPath(import.meta.url));
const dados = JSON.parse(fs.readFileSync(path.join(here, "..", "atracoes.json"), "utf8"));

try {
  for (const item of dados) {
    const categoria = await prisma.categoria.upsert({
      where: { nome: item.categoria }, update: {}, create: { nome: item.categoria }
    });
    const tags = [];
    for (const nome of item.tags) {
      tags.push(await prisma.tag.upsert({ where: { nome }, update: {}, create: { nome } }));
    }
    const existente = await prisma.atracao.findFirst({ where: { nome: item.nome } });
    const payload = {
      nome: item.nome, descricao: item.descricao,
      cidade: item.localizacao?.cidade || "Balsas",
      estado: item.localizacao?.estado || "MA",
      distanciaCentroKm: item.distanciaCentroKm,
      categoriaId: categoria.id,
      tags: { create: tags.map(tag => ({ tag: { connect: { id: tag.id } } })) }
    };
    if (existente) {
      await prisma.atracaoTag.deleteMany({ where: { atracaoId: existente.id } });
      await prisma.atracao.update({ where: { id: existente.id }, data: payload });
    } else {
      await prisma.atracao.create({ data: payload });
    }
  }
  console.log(`${dados.length} atrações processadas com sucesso.`);
} finally { await prisma.$disconnect(); }
