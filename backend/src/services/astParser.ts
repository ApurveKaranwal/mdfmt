import ts from "typescript";

export interface AstExtractionResult {
  exportedFunctions: string[];
  exportedClasses: string[];
  exportedInterfaces: string[];
}

export function parseAstForFile(content: string, fileName: string): AstExtractionResult {
  const result: AstExtractionResult = {
    exportedFunctions: [],
    exportedClasses: [],
    exportedInterfaces: [],
  };

  try {
    const sourceFile = ts.createSourceFile(
      fileName,
      content,
      ts.ScriptTarget.Latest,
      true
    );

    function visit(node: ts.Node) {
      if (ts.isFunctionDeclaration(node) && node.name && isExported(node)) {
        const signature = extractSignature(node, content);
        if (signature) result.exportedFunctions.push(signature);
      } else if (ts.isClassDeclaration(node) && node.name && isExported(node)) {
        result.exportedClasses.push(node.name.text);
      } else if (ts.isInterfaceDeclaration(node) && node.name && isExported(node)) {
        result.exportedInterfaces.push(node.name.text);
      } else if (ts.isVariableStatement(node) && isExported(node)) {
        // Look for arrow functions like `export const myFunc = () => {}`
        for (const declaration of node.declarationList.declarations) {
          if (declaration.name && ts.isIdentifier(declaration.name)) {
            if (declaration.initializer && (ts.isArrowFunction(declaration.initializer) || ts.isFunctionExpression(declaration.initializer))) {
              result.exportedFunctions.push(declaration.name.text);
            }
          }
        }
      }

      ts.forEachChild(node, visit);
    }

    visit(sourceFile);
  } catch (e) {
    console.error(`AST Parsing failed for ${fileName}`, e);
  }

  return result;
}

function isExported(node: ts.Node): boolean {
  if (ts.canHaveModifiers(node)) {
    const modifiers = ts.getModifiers(node);
    if (modifiers) {
      return modifiers.some(modifier => modifier.kind === ts.SyntaxKind.ExportKeyword);
    }
  }
  return false;
}

function extractSignature(node: ts.FunctionDeclaration, sourceCode: string): string | null {
  if (!node.name) return null;
  
  // Extract just the signature part, e.g., "function foo(a: string): void"
  // Find where the block '{' starts
  if (node.body) {
    const signatureLength = node.body.getStart() - node.getStart();
    const fullSig = sourceCode.substr(node.getStart(), signatureLength).trim();
    // remove the "export " prefix
    return fullSig.replace(/^export\s+/, "").replace(/^default\s+/, "").trim();
  }
  
  return node.name.text;
}
