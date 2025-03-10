#!/bin/bash

echo "Creating LaserDog Installer..."

# Build the React application
npm run build:react

# Create the dist directory if it doesn't exist
mkdir -p dist/LaserDog

# Copy necessary files
echo "Copying files..."
cp -r build dist/LaserDog/
cp main.js dist/LaserDog/
cp preload.js dist/LaserDog/
cp package.json dist/LaserDog/

# Create a startup script
cat >dist/LaserDog/start-laserdog.sh <<'EOF'
#!/bin/bash
echo "Starting LaserDog..."
cd "$(dirname "$0")"
if [ ! -d "node_modules" ]; then
  echo "First-time setup: Installing dependencies..."
  npm install --production
fi
./node_modules/.bin/electron .
EOF

# Make the startup script executable
chmod +x dist/LaserDog/start-laserdog.sh

# Create a README file
cat >dist/LaserDog/README.txt <<'EOF'
# LaserDog

## Getting Started

1. Make sure you have Node.js installed (https://nodejs.org)
2. Run start-laserdog.sh to start the application
3. The first time you run it, it will install dependencies (this may take a few minutes)
4. After that, the application will start automatically
EOF

echo "Installation package created in dist/LaserDog"
echo "You can zip this folder and distribute it to users"
