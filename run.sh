#!/bin/bash

# LaserDog Development Helper Script

# Colors for better readability
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to display help
show_help() {
    echo -e "${BLUE}LaserDog Development Helper${NC}"
    echo -e "${YELLOW}Usage:${NC}"
    echo -e "  ./run.sh [command]"
    echo -e "\n${YELLOW}Available commands:${NC}"
    echo -e "  ${GREEN}install${NC}      - Install all dependencies"
    echo -e "  ${GREEN}dev${NC}          - Start the app in development mode"
    echo -e "  ${GREEN}build${NC}        - Build the app for production"
    echo -e "  ${GREEN}clean${NC}        - Clean build artifacts"
    echo -e "  ${GREEN}test${NC}         - Run tests"
    echo -e "  ${GREEN}help${NC}         - Show this help message"
}

# Check if the script is run with a command
if [ $# -eq 0 ]; then
    show_help
    exit 1
fi

# Process commands
case "$1" in
install)
    echo -e "${BLUE}Installing dependencies...${NC}"
    npm install
    ;;
dev)
    echo -e "${BLUE}Starting development server...${NC}"
    npm run dev
    ;;
build)
    echo -e "${BLUE}Building for production...${NC}"
    npm run build
    ;;
clean)
    echo -e "${BLUE}Cleaning build artifacts...${NC}"
    rm -rf dist
    rm -rf node_modules/.cache
    echo -e "${GREEN}Clean complete!${NC}"
    ;;
test)
    echo -e "${BLUE}Running tests...${NC}"
    npm test
    ;;
help)
    show_help
    ;;
*)
    echo -e "${RED}Unknown command: $1${NC}"
    show_help
    exit 1
    ;;
esac

exit 0
