// Este script inserta datos de ejemplo. Se ejecuta con:
//   npx prisma db seed
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const papeleria = await prisma.categoria.upsert({
    where: { nombre: "Papelería" },
    update: {},
    create: { nombre: "Papelería", descripcion: "Insumos de oficina y aula" },
  });

  const limpieza = await prisma.categoria.upsert({
    where: { nombre: "Limpieza" },
    update: {},
    create: { nombre: "Limpieza", descripcion: "Insumos de limpieza de la bodega" },
  });

  const hojas = await prisma.producto.create({
    data: {
      nombre: "Resma de papel bond carta",
      descripcion: "Paquete de 500 hojas",
      precio: 45.5,
      stock: 100,
      stockMinimo: 20,
      categoriaId: papeleria.id,
    },
  });

  await prisma.producto.create({
    data: {
      nombre: "Marcador permanente negro",
      precio: 6.0,
      stock: 50,
      stockMinimo: 10,
      categoriaId: papeleria.id,
    },
  });

  await prisma.producto.create({
    data: {
      nombre: "Jabón líquido para manos",
      precio: 18.75,
      stock: 15,
      stockMinimo: 5,
      categoriaId: limpieza.id,
    },
  });

  // Un movimiento de ejemplo para el producto "hojas"
  await prisma.movimiento.create({
    data: {
      tipo: "ENTRADA",
      cantidad: 100,
      motivo: "Compra inicial de inventario",
      productoId: hojas.id,
    },
  });

  console.log("✅ Datos de ejemplo insertados");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
