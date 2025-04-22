import * as markdownlint from 'markdownlint';
import { defaultConfig } from './config.js';
import { ToolParams, ValidationResult } from './types.js';

export async function validateMarkdown(params: ToolParams): Promise<ValidationResult> {
  try {
    const { content, config = {} } = params;
    
    // Merge user config with default config
    const mergedConfig = { ...defaultConfig, ...config };
    
    const options: markdownlint.Options = {
      strings: { content },
      config: mergedConfig
    };

    const result = await markdownlint.promises.markdownlint(options);
    const errors = result['content'] || [];

    return {
      isValid: errors.length === 0,
      errors: errors.map(error => ({
        lineNumber: error.lineNumber,
        ruleDescription: error.ruleDescription,
        ruleInformation: error.ruleInformation,
        errorDetail: error.errorDetail,
        errorContext: error.errorContext,
        errorRange: error.errorRange as [number, number]
      }))
    };
  } catch (error) {
    return {
      isValid: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
} 