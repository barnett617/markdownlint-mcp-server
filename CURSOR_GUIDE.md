# Cursor MCP Server Integration Guide

This guide explains how to integrate the markdownlint MCP server with Cursor to validate and improve markdown generation.

## Prerequisites

- Node.js 18.x or later
- npm 7 or later
- Cursor with MCP server support

## Installation

No installation is required as we'll use `npx` to run the package directly.

## Cursor Configuration

To configure Cursor to use the markdownlint MCP server, create or update the MCP server configuration file:

1. Create or edit the file named `cursor-mcp-servers.json` in your Cursor configuration directory (typically `~/.cursor/` or `%APPDATA%/Cursor/` on Windows)

2. Add the markdownlint MCP server configuration:
   ```json
   {
     "mcpServers": {
       "markdownlint-mcp": {
         "command": "npx",
         "args": [
           "-y",
           "markdownlint-mcp-server"
         ],
         "env": {}
       }
     }
   }
   ```

3. Restart Cursor to apply the configuration

The configuration file supports the following options:
- `command`: The command to start the MCP server (use "npx")
- `args`: Array of command-line arguments (use ["-y", "markdownlint-mcp-server"])
- `env`: Environment variables (optional)

## Usage in Cursor

Once configured, Cursor will automatically use the markdownlint MCP server when generating markdown content. The server provides two tools:

### 1. Validate Tool

Validates markdown content against markdownlint rules:

```typescript
// Example request
{
  "tool": "validate",
  "params": {
    "content": "# Heading 1\n\nThis is some content.",
    "config": {
      "MD013": false  // Optional: disable line length rule
    }
  }
}

// Example response
{
  "isValid": true,
  "errors": []
}
```

### 2. Rules Tool

Retrieves the available markdownlint rules:

```typescript
// Example request
{
  "tool": "rules",
  "params": {}
}

// Example response
{
  "MD001": true,
  "MD003": { "style": "consistent" },
  // ... other rules
}
```

## Error Handling

When validation errors occur, Cursor will receive detailed information about each issue:

```typescript
{
  "isValid": false,
  "errors": [
    {
      "lineNumber": 1,
      "ruleDescription": "Heading levels should only increment by one level at a time",
      "ruleInformation": "MD001",
      "errorDetail": "Expected: h2; Actual: h1",
      "errorContext": "# Heading 1",
      "errorRange": [0, 10]
    }
  ]
}
```

## Custom Configuration

You can customize the markdownlint rules by providing a configuration object when using the validate tool:

```typescript
{
  "tool": "validate",
  "params": {
    "content": "# Heading 1\n\nThis is some content.",
    "config": {
      "MD013": false,  // Disable line length rule
      "MD025": false   // Disable multiple top level headings rule
    }
  }
}
```

## Troubleshooting

1. **Server Not Starting**
   - Ensure Node.js is installed and in your PATH
   - Check if the port is already in use
   - Verify the installation with `markdownlint-mcp-server --version`
   - Verify the JSON configuration file is in the correct location and format

2. **Connection Issues**
   - Verify the MCP server is running
   - Check the JSON configuration file format
   - Ensure stdio communication is working
   - Check Cursor logs for configuration errors

3. **Validation Errors**
   - Review the error messages for specific issues
   - Check the markdownlint documentation for rule explanations
   - Adjust the configuration if needed

## Support

For issues or questions:
- Open an issue on GitHub
- Check the markdownlint documentation
- Review the MCP server logs
- Check Cursor's MCP server documentation

## License

MIT 