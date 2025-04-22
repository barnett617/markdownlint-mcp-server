#!/usr/bin/env node

import { markdownlintMcpServer } from './index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';

async function main() {
  const server = markdownlintMcpServer();
  const transport = new StdioServerTransport();
  
  try {
    console.log('Starting markdownlint MCP server...');

    // Connect the server
    await server.connect(transport);
    console.log('Server connected successfully');
    
    // Handle process signals
    process.on('SIGINT', cleanup);
    process.on('SIGTERM', cleanup);
    
    // Handle process errors
    process.on('uncaughtException', (error) => {
      console.error('Uncaught exception:', error);
      cleanup();
    });

    process.on('unhandledRejection', (error) => {
      console.error('Unhandled rejection:', error);
      cleanup();
    });
    
  } catch (error) {
    console.error('Failed to start markdownlint MCP server:', error);
    cleanup();
    process.exit(1);
  }

  function cleanup() {
    console.log('Cleaning up...');
    try {
      transport.close();
      server.disconnect();
    } catch (error) {
      console.error('Error during cleanup:', error);
    }
    process.exit(0);
  }
}

main().catch((error) => {
  console.error('Unhandled error:', error);
  process.exit(1);
}); 