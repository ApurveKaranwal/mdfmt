import natural from "natural";
import nlp from "compromise";

let classifier: natural.BayesClassifier | null = null;
let nlpPipeline: any = null;
let summarizationPipeline: any = null;

// Initialize ML environment
export async function initMLEngine() {
  if (!classifier) {
    classifier = new natural.BayesClassifier();
    
    // Train local Naive Bayes for Endpoint descriptions
    classifier.addDocument('users/login', 'User Login API');
    classifier.addDocument('users/register', 'User Registration API');
    classifier.addDocument('api/users', 'User Management Endpoint');
    classifier.addDocument('api/products', 'Product Catalog Endpoint');
    classifier.addDocument('products/search', 'Product Search API');
    classifier.addDocument('cart/add', 'Add to Cart Endpoint');
    classifier.addDocument('cart/checkout', 'Checkout Processing API');
    classifier.addDocument('health', 'System Health Check');
    classifier.addDocument('metrics', 'Application Metrics');
    classifier.addDocument('auth/callback', 'OAuth Callback Handler');
    classifier.addDocument('payments/webhook', 'Payment Webhook Listener');
    classifier.addDocument('upload/image', 'Image Upload Service');
    classifier.addDocument('download', 'File Download Endpoint');
    classifier.train();
  }

  if (!nlpPipeline) {
    try {
      // Safely import ESM module from CommonJS
      const transformersImport = new Function("return import('@huggingface/transformers')");
      const { pipeline } = await transformersImport();
      
      // Initialize a tiny Zero-Shot Classification model (runs locally via WebAssembly)
      console.log("Loading local AIML models (may take a moment on first run)...");
      nlpPipeline = await pipeline('zero-shot-classification', 'Xenova/mobilebert-uncased-mnli');
      summarizationPipeline = await pipeline('summarization', 'Xenova/distilbart-cnn-6-6');
      console.log("AIML Engine Initialized Successfully.");
    } catch (e) {
      console.error("Failed to load Hugging Face Transformers locally. Falling back to NLP heuristics.", e);
    }
  }
}

// Predict Endpoint Description using Local Naive Bayes
export function predictEndpointDescription(path: string, method: string, fallback: string): string {
  if (!classifier) return fallback;
  
  try {
    const classification = classifier.getClassifications(path);
    // If confidence is relatively good, use the ML prediction
    // Increased threshold from 0.05 to 0.4 to prevent false positives like everything being "User Login API"
    if (classification.length > 0 && classification[0].value > 0.4) {
      return classification[0].label;
    }
  } catch (e) {
    // Ignore
  }
  return fallback;
}

// Extract keywords using local TF-IDF (Term Frequency-Inverse Document Frequency)
export function extractKeywords(text: string, maxKeywords = 10): string[] {
  const TfIdf = natural.TfIdf;
  const tfidf = new TfIdf();
  tfidf.addDocument(text);
  
  const terms: string[] = [];
  const stopWords = new Set(["const", "import", "export", "function", "return", "from", "class", "async", "await", "default", "interface", "type", "public", "private", "true", "false", "null", "undefined", "usestate", "useeffect", "console", "this", "that", "with"]);

  tfidf.listTerms(0).slice(0, 40).forEach(item => {
    const term = item.term.toLowerCase();
    // Filter out numbers, very short terms, and common code syntax
    if (term.length > 3 && !/^[0-9]+$/.test(term) && !stopWords.has(term)) {
       terms.push(item.term);
    }
  });
  
  return terms.slice(0, maxKeywords);
}

// Advanced Zero-Shot Classification for Architecture using Deep Learning
export async function classifyTextWithDeepLearning(content: string, labels: string[]): Promise<string[]> {
  if (!nlpPipeline) return [];
  
  try {
    // Truncate content to avoid memory issues (MobileBERT handles max 512 tokens usually)
    const snippet = content.slice(0, 1000); 
    const result = await nlpPipeline(snippet, labels);
    
    const matched = [];
    for (let i = 0; i < result.scores.length; i++) {
      if (result.scores[i] > 0.3) {
         matched.push(result.labels[i]);
      }
    }
    return matched;
  } catch(e) {
    return [];
  }
}

// Generate Abstractive Summary of the Project using Deep Learning
export async function generateProjectSummary(contextText: string, projectName: string): Promise<string> {
  if (!summarizationPipeline || !contextText.trim()) {
    return `**${projectName}** is an advanced application built with modern scalable design patterns.`;
  }

  try {
    const prompt = `Describe a software project named ${projectName} that features: ${contextText.slice(0, 800)}. This project is`;
    const result = await summarizationPipeline(prompt, {
      max_new_tokens: 60,
      min_length: 20,
    });
    
    if (result && result.length > 0 && result[0].summary_text) {
      return `**${projectName}** ${result[0].summary_text.trim()}`;
    }
  } catch (e) {
    console.error("Summarization failed", e);
  }
  
  return `**${projectName}** is an advanced application leveraging modern scalable design patterns.`;
}

// Grammar Polish using local compromise NLP
export function polishText(text: string): string {
  if (!text) return text;
  let doc = nlp(text);
  // Auto-capitalize the first word
  doc.sentences().toTitleCase();
  return doc.text();
}
