# Ejecutar el script con: ./install-dependencies.sh

# Definir las dependencias y sus versiones
declare -A dependencies=(
  ["react"]="^18.3.1"
  ["react-dom"]="^18.3.1"
)

declare -A devDependencies=(
  ["@types/react"]="^18.3.3"
  ["@types/react-dom"]="^18.3.0"
  ["@vitejs/plugin-react"]="^4.3.1"
  ["autoprefixer"]="^10.4.19"
  ["eslint"]="^8.57.0"
  ["eslint-config-prettier"]="^9.1.0"
  ["eslint-plugin-react"]="^7.34.2"
  ["eslint-plugin-react-hooks"]="^4.6.2"
  ["eslint-plugin-react-refresh"]="^0.4.7"
  ["postcss"]="^8.4.38"
  ["prettier"]="^3.3.2"
  ["tailwindcss"]="^3.4.4"
  ["vite"]="^5.3.1"
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
