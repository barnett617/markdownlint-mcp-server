import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { defaultConfig } from './config.js';
import { toolParamsSchema } from './types.js';
import { validateMarkdown } from './validation.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';

export class MarkdownlintMcpServer extends McpServer {
  private currentTransport: StdioServerTransport | null = null;

  constructor() {
    super({
      name: 'markdownlint-server',
      version: '1.0.0'
    });

    // Define the validate tool
    this.tool(
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
    this.tool(
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
  }

  async connect(transport: StdioServerTransport): Promise<void> {
    this.currentTransport = transport;
    await super.connect(transport);
  }

  disconnect(): void {
    if (this.currentTransport) {
      this.currentTransport.close();
      this.currentTransport = null;
    }
  }
}

export function markdownlintMcpServer() {
  return new MarkdownlintMcpServer();
} 