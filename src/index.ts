#!/usr/bin/env node

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  Tool,
} from "@modelcontextprotocol/sdk/types.js";
import { validateMarkdown } from './validation.js';
import { defaultConfig } from './config.js';

const VALIDATE_TOOL: Tool = {
  name: "validate",
  description: 
    "Validates markdown content against markdownlint rules. " +
    "Checks for common markdown style and formatting issues. " +
    "Returns validation results including any errors found. " +
    "Can be configured with custom markdownlint rules.",
  inputSchema: {
    type: "object",
    properties: {
      content: {
        type: "string",
        description: "The markdown content to validate"
      },
      config: {
        type: "object",
        description: "Optional markdownlint configuration",
        additionalProperties: true
      }
    },
    required: ["content"]
  }
};

const RULES_TOOL: Tool = {
  name: "rules",
  description: 
    "Returns the available markdownlint rules and their configurations. " +
    "Each rule includes its default settings and description.",
  inputSchema: {
    type: "object",
    properties: {},
    additionalProperties: false
  }
};

// Server implementation
const server = new Server(
  {
    name: "markdownlint-server",
    version: "1.0.0",
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

function isValidateArgs(args: unknown): args is { content: string; config?: Record<string, any> } {
  return (
    typeof args === "object" &&
    args !== null &&
    "content" in args &&
    typeof (args as { content: string }).content === "string" &&
    (!("config" in args) || typeof (args as { config: unknown }).config === "object")
  );
}

function isRulesArgs(args: unknown): args is Record<string, never> {
  return (
    typeof args === "object" &&
    args !== null &&
    Object.keys(args).length === 0
  );
}

// Tool handlers
server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: [VALIDATE_TOOL, RULES_TOOL],
}));

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  try {
    const { name, arguments: args } = request.params;

    if (!args) {
      throw new Error("No arguments provided");
    }

    switch (name) {
      case "validate": {
        if (!isValidateArgs(args)) {
          throw new Error("Invalid arguments for validate tool");
        }
        const result = await validateMarkdown(args);
        return {
          content: [{
            type: "text",
            text: JSON.stringify(result, null, 2)
          }],
          isError: !result.isValid
        };
      }

      case "rules": {
        if (!isRulesArgs(args)) {
          throw new Error("Invalid arguments for rules tool");
        }
        return {
          content: [{
            type: "text",
            text: JSON.stringify(defaultConfig, null, 2)
          }],
          isError: false
        };
      }

      default:
        return {
          content: [{ type: "text", text: `Unknown tool: ${name}` }],
          isError: true,
        };
    }
  } catch (error) {
    return {
      content: [
        {
          type: "text",
          text: `Error: ${error instanceof Error ? error.message : String(error)}`,
        },
      ],
      isError: true,
    };
  }
});

async function runServer() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("Markdownlint MCP Server running on stdio");
}

runServer().catch((error) => {
  console.error("Fatal error running server:", error);
  process.exit(1);
}); 