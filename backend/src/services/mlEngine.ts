import natural from "natural";
import nlp from "compromise";

let classifier: natural.BayesClassifier | null = null;


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



// Grammar Polish using local compromise NLP
export function polishText(text: string): string {
  if (!text) return text;
  let doc = nlp(text);
  // Auto-capitalize the first word
  doc.sentences().toTitleCase();
  return doc.text();
}
