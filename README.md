# markdownlint-mcp-server

A Model Context Protocol (MCP) server implementation for markdownlint that validates markdown content against markdownlint rules.

## Features

- Validates markdown content using markdownlint
- Provides access to markdownlint rules
- Supports custom configuration
- Implements the MCP protocol for AI/LLM integration
- Can be used by Cursor to validate generated markdown

## Installation

```bash
npm install markdownlint-mcp-server
```

## Usage

### As a CLI

```bash
markdownlint-mcp-server
```

The server will start and listen for MCP protocol messages on stdio.

### As a Library

```typescript
import { markdownlintMcpServer } from 'markdownlint-mcp-server';

const server = markdownlintMcpServer();
// Use the server with your preferred MCP transport
```

### Integration with Cursor

Cursor can use this MCP server to validate its markdown generation:

1. Start the MCP server
2. Cursor will connect to the server
3. When generating markdown content, Cursor will:
   - Send the content to the `validate` tool
   - Check for any linting errors
   - Use the validation results to improve its markdown generation
   - Ensure the final output follows markdownlint rules

Example workflow:
```typescript
// Cursor's markdown generation process
const markdown = generateMarkdown();
const validation = await validateMarkdown(markdown);
if (!validation.isValid) {
  // Use the validation errors to improve markdown generation
  // The errors provide detailed information about what needs to be fixed
  console.log('Markdown validation errors:', validation.errors);
  // Cursor can use this information to adjust its generation
}
return markdown;
```

The validation results include detailed information about any issues found:
- Line numbers where issues occur
- Rule descriptions and information
- Error details and context
- Range of text affected

## API

The server provides two tools:

1. `validate` - Validates markdown content
   ```typescript
   {
     content: string;      // The markdown content to validate
     config?: object;      // Optional markdownlint configuration
   }
   ```

2. `rules` - Returns the available markdownlint rules
   ```typescript
   {}  // No parameters needed
   ```

## Configuration

The server uses a default configuration based on markdownlint's recommended rules. You can override these rules by providing a custom configuration when using the validate tool.

## Development

### Building

```bash
npm run build
```

### Project Structure

- `src/`
  - `index.ts` - Main server implementation
  - `config.ts` - Default markdownlint configuration
  - `types.ts` - Shared types and schemas
  - `validation.ts` - Markdown validation logic
  - `bin.ts` - CLI entry point

### CI/CD

The project uses GitHub Actions for continuous integration and deployment:

- **CI Pipeline**: Runs on every push and pull request
  - Tests on Node.js 18.x and 20.x
  - Builds the project
  - Runs type checking

- **Release Pipeline**: Runs when a new release is published
  - Builds the project
  - Publishes to npm

To create a new release:
1. Update the version in `package.json`
2. Create a new release on GitHub
3. The release workflow will automatically publish to npm

## License

MIT 