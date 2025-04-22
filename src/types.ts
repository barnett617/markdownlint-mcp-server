import { z } from 'zod';

export interface ValidationError {
  lineNumber: number;
  ruleDescription: string;
  ruleInformation: string;
  errorDetail: string;
  errorContext: string;
  errorRange: [number, number];
}

export interface ValidationResult {
  isValid: boolean;
  errors?: ValidationError[];
  error?: string;
}

export interface ToolParams {
  content: string;
  config?: Record<string, any>;
}

export const toolParamsSchema = {
  content: z.string(),
  config: z.record(z.any()).optional()
}; 