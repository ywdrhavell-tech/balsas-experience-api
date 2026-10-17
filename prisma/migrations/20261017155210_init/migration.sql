-- CreateTable
CREATE TABLE "Categoria" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Categoria_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Atracao" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "descricao" TEXT NOT NULL,
    "cidade" TEXT NOT NULL DEFAULT 'Balsas',
    "estado" TEXT NOT NULL DEFAULT 'MA',
    "distanciaCentroKm" DOUBLE PRECISION,
    "categoriaId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Atracao_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Tag" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,

    CONSTRAINT "Tag_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AtracaoTag" (
    "atracaoId" INTEGER NOT NULL,
    "tagId" INTEGER NOT NULL,

    CONSTRAINT "AtracaoTag_pkey" PRIMARY KEY ("atracaoId","tagId")
);

-- CreateTable
CREATE TABLE "Avaliacao" (
    "id" SERIAL NOT NULL,
    "nota" INTEGER NOT NULL,
    "comentario" TEXT,
    "autor" TEXT,
    "atracaoId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Avaliacao_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Categoria_nome_key" ON "Categoria"("nome");

-- CreateIndex
CREATE INDEX "Atracao_categoriaId_idx" ON "Atracao"("categoriaId");

-- CreateIndex
CREATE INDEX "Atracao_nome_idx" ON "Atracao"("nome");

-- CreateIndex
CREATE UNIQUE INDEX "Tag_nome_key" ON "Tag"("nome");

-- CreateIndex
CREATE INDEX "AtracaoTag_tagId_idx" ON "AtracaoTag"("tagId");

-- CreateIndex
CREATE INDEX "Avaliacao_atracaoId_idx" ON "Avaliacao"("atracaoId");

-- AddForeignKey
ALTER TABLE "Atracao" ADD CONSTRAINT "Atracao_categoriaId_fkey" FOREIGN KEY ("categoriaId") REFERENCES "Categoria"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AtracaoTag" ADD CONSTRAINT "AtracaoTag_atracaoId_fkey" FOREIGN KEY ("atracaoId") REFERENCES "Atracao"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AtracaoTag" ADD CONSTRAINT "AtracaoTag_tagId_fkey" FOREIGN KEY ("tagId") REFERENCES "Tag"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Avaliacao" ADD CONSTRAINT "Avaliacao_atracaoId_fkey" FOREIGN KEY ("atracaoId") REFERENCES "Atracao"("id") ON DELETE CASCADE ON UPDATE CASCADE;
