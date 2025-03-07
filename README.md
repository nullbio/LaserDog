# LaserDog

LaserDog is an AI-powered todo list and note-taking application built with Electron and React.

## Features

- **Project Management**: Create and organize multiple projects
- **Todo Lists**: Create nested todo lists with expandable/collapsible sections
- **AI-Powered Breakdowns**: Break down complex tasks into smaller, actionable steps using AI
- **Drag & Drop**: Rearrange todo items with drag and drop functionality
- **Customizable Interface**: Configure sidebar position and other settings
- **Floating Toolbar**: Access common actions from anywhere in the app
- **Auto-Save**: All changes are automatically saved

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository:

   ```
   git clone https://github.com/yourusername/LaserDog.git
   cd LaserDog
   ```

2. Install dependencies:

   ```
   ./run.sh install
   ```

3. Start the development server:

   ```
   ./run.sh dev
   ```

### Building for Production

To build the application for your platform:

```
./run.sh build
```

This will create distributable packages in the `dist` directory.

## Development

LaserDog includes a helper script (`run.sh`) for common development tasks:

- `./run.sh install` - Install dependencies
- `./run.sh dev` - Start development server
- `./run.sh build` - Build for production
- `./run.sh clean` - Clean build artifacts
- `./run.sh test` - Run tests

## AI Integration

LaserDog uses OpenAI's API for the AI-powered todo breakdown feature. To use this feature:

1. Get an API key from [OpenAI](https://platform.openai.com/)
2. Open the settings panel in the app (click the gear icon)
3. Enter your API key in the appropriate field
4. Save your settings

## License

This project is licensed under the MIT License - see the LICENSE file for details.
