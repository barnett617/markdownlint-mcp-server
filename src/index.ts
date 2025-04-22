import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { defaultConfig } from './config.js';
import { toolParamsSchema } from './types.js';
import { validateMarkdown } from './validation.js';

export function markdownlintMcpServer() {
  const server = new McpServer({
    name: 'markdownlint-server',
    version: '1.0.0'
  });

  // Define the validate tool
  server.tool(
    'validate',
    toolParamsSchema,
    async (params) => {
      const result = await validateMarkdown(params);
      return {
        content: [{
          type: 'text',
          text: JSON.stringify(result, null, 2)
        }],
        isError: !result.isValid
      };
    }
  );

  // Define the rules tool
  server.tool(
    'rules',
    {},
    async () => {
      try {
        return {
          content: [{
            type: 'text',
            text: JSON.stringify(defaultConfig, null, 2)
          }]
        };
      } catch (error) {
        return {
          content: [{
            type: 'text',
            text: JSON.stringify({
              error: error instanceof Error ? error.message : 'Unknown error'
            }, null, 2)
          }],
          isError: true
        };
      }
    }
  );

  return server;
} 