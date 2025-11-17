/**
 * Document Classifier Client
 * Helper functions to interact with the document classification API
 */

export interface ClassificationResult {
  success: boolean;
  prediction?: string;
  probabilities?: Record<string, number>;
  confidence?: number;
  text_length?: number;
  error?: string;
}

export interface BatchClassificationResult {
  success: boolean;
  results?: Array<{
    index: number;
    prediction: string;
    confidence?: number;
    text_length: number;
  }>;
  total?: number;
  error?: string;
}

export interface ModelInfo {
  success: boolean;
  model_type?: string;
  has_classes?: boolean;
  supports_probabilities?: boolean;
  classes?: string[];
  num_classes?: number;
  num_features?: number;
  error?: string;
}

/**
 * Classify a single document
 */
export async function classifyDocument(
  text: string,
  returnProbabilities: boolean = true
): Promise<ClassificationResult> {
  try {
    const response = await fetch('/api/classifier', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text,
        return_probabilities: returnProbabilities,
      }),
    });

    const data = await response.json();
    return data;
  } catch (error: any) {
    return {
      success: false,
      error: error.message || 'Failed to classify document',
    };
  }
}

/**
 * Classify multiple documents at once
 */
export async function classifyDocuments(
  documents: string[],
  returnProbabilities: boolean = true
): Promise<BatchClassificationResult> {
  try {
    const response = await fetch('/api/classifier/batch', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        documents,
        return_probabilities: returnProbabilities,
      }),
    });

    const data = await response.json();
    return data;
  } catch (error: any) {
    return {
      success: false,
      error: error.message || 'Failed to classify documents',
    };
  }
}

/**
 * Get information about the classifier model
 */
export async function getModelInfo(): Promise<ModelInfo> {
  try {
    const response = await fetch('/api/classifier', {
      method: 'GET',
    });

    const data = await response.json();
    return data;
  } catch (error: any) {
    return {
      success: false,
      error: error.message || 'Failed to get model info',
    };
  }
}

/**
 * Check if the classifier service is available
 */
export async function checkClassifierHealth(): Promise<boolean> {
  try {
    const info = await getModelInfo();
    return info.success;
  } catch {
    return false;
  }
}
