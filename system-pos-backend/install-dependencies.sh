# Ejecutar el script con: ./install-dependencies.sh

# Definir las dependencias y sus versiones
declare -A dependencies=(
  ["cors"]="^2.8.5"
  ["express"]="^4.19.2"
  ["jsonwebtoken"]="^9.0.2"
  ["morgan"]="^1.10.0"
  ["mysql2"]="^3.10.1"
  ["zod"]="^3.23.8"
)

declare -A devDependencies=(
  ["dotenv"]="^16.4.5"
  ["eslint"]="^8.57.0"
  ["eslint-config-prettier"]="^9.1.0"
  ["nodemon"]="^3.1.4"
  ["prettier"]="^3.3.2"
)

# Instalar las dependencias
echo "Instalando dependencias..."
for package in "${!dependencies[@]}"; do
  npm install "$package@${dependencies[$package]}"
done

# Instalar las dependencias de desarrollo
echo "Instalando dependencias de desarrollo..."
for package in "${!devDependencies[@]}"; do
  npm install --save-dev "$package@${devDependencies[$package]}"
done

echo "Instalación completada."
