import markdownlint from 'markdownlint';
import { defaultConfig } from './config.js';
import type { ValidationResult, ToolParams } from './types.js';

export async function validateMarkdown(params: ToolParams): Promise<ValidationResult> {
  try {
    const { content, config } = params;
    
    if (!content) {
      return {
        isValid: false,
        error: 'Content is required'
      };
    }

    if (typeof content !== 'string') {
      return {
        isValid: false,
        error: 'Content must be a string'
      };
    }

    const options = {
      strings: {
        content: content
      },
      config: {
        ...defaultConfig,
        ...config
      }
    };

    const results = await new Promise<markdownlint.LintResults>((resolve, reject) => {
      markdownlint(options, (err, result) => {
        if (err) {
          reject(err);
        } else if (!result) {
          reject(new Error('No result returned from markdownlint'));
        } else {
          resolve(result);
        }
      });
    });
    
    // Get the results for our content
    const lintErrors = results['content'] || [];
    
    if (lintErrors.length === 0) {
      return {
        isValid: true
      };
    }

    const errors = lintErrors.map((error: markdownlint.LintError) => ({
      lineNumber: error.lineNumber,
      ruleDescription: error.ruleDescription,
      ruleInformation: error.ruleInformation,
      errorDetail: error.errorDetail,
      errorContext: error.errorContext,
      errorRange: error.errorRange ? [error.errorRange[0], error.errorRange[1]] as [number, number] : [0, 0] as [number, number]
    }));

    return {
      isValid: false,
      errors
    };
  } catch (error) {
    return {
      isValid: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
} 