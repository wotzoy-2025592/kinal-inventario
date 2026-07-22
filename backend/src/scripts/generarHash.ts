// Uso: npx ts-node src/scripts/generarHash.ts miPasswordSegura
// Imprime en consola el hash bcrypt que debes copiar en ADMIN_PASSWORD_HASH del .env
import bcrypt from "bcryptjs";

const password = process.argv[2];

if (!password) {
  console.error("Debes indicar una contraseña. Ejemplo:");
  console.error("  npx ts-node src/scripts/generarHash.ts admin123");
  process.exit(1);
}

const hash = bcrypt.hashSync(password, 10);
console.log("Copia este valor en ADMIN_PASSWORD_HASH:");
console.log(hash);
