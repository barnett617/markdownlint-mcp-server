#!/usr/bin/env node

import { markdownlintMcpServer } from './index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';

async function main() {
  try {
    const server = markdownlintMcpServer();
    const transport = new StdioServerTransport();
    
    console.log('Starting markdownlint MCP server...');
    await server.connect(transport);
    
    // Keep the process running
    process.on('SIGINT', () => {
      console.log('Shutting down markdownlint MCP server...');
      transport.close();
      process.exit(0);
    });
  } catch (error) {
    console.error('Failed to start markdownlint MCP server:', error);
    process.exit(1);
  }
}

main(); 