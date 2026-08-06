import { intro, outro, spinner, text, select, confirm, isCancel } from '@clack/prompts';
import picocolors from 'picocolors';
import fs from 'fs-extra';
import path from 'path';
import { scanLocalRepository } from '../scanner/localScanner';
import { generateReadme } from '../api/client';
import { showTerminalDiff } from '../utils/diff';

export interface GenerateCmdFlags {
  output?: string;
  yes?: boolean;
  serverUrl?: string;
  groqKey?: string;
  instructions?: string;
  offline?: boolean;
}

export async function runGenerateCommand(flags: GenerateCmdFlags = {}) {
  intro(picocolors.bgCyan(picocolors.black(' mdfmt — README Studio CLI ')));

  const s = spinner();
  s.start('Analyzing workspace & repository files...');

  const rootDir = process.cwd();
  let snapshot;

  try {
    snapshot = await scanLocalRepository(rootDir);
    s.stop(
      `Analyzed ${picocolors.bold(picocolors.green(snapshot.repo))} (${picocolors.cyan(
        snapshot.detectedStack.join(', ') || 'General Project'
      )})`
    );
  } catch (err: any) {
    s.stop(picocolors.red('Failed to analyze repository directory.'));
    outro(picocolors.red(`Error: ${err.message}`));
    return;
  }

  let instructions = flags.instructions;
  let docDepth: 'readme-only' | 'standard' | 'complete' = 'standard';

  // Interactive mode if non-interactive flags aren't fully set
  if (!flags.yes) {
    const toneChoice = await select({
      message: 'Select documentation depth:',
      options: [
        { value: 'readme-only', label: 'README Only (Clean single file)' },
        { value: 'standard', label: 'Standard (README + core architecture notes)' },
        { value: 'complete', label: 'Complete Suite (README + full docs directory)' }
      ]
    });

    if (isCancel(toneChoice)) {
      outro(picocolors.yellow('Generation cancelled.'));
      return;
    }

    docDepth = toneChoice as any;

    const customInstructionsPrompt = await text({
      message: 'Any extra instructions or description for the AI? (Optional)',
      placeholder: 'e.g., Focus on security features, add Docker setup guide...'
    });

    if (isCancel(customInstructionsPrompt)) {
      outro(picocolors.yellow('Generation cancelled.'));
      return;
    }

    if (typeof customInstructionsPrompt === 'string' && customInstructionsPrompt.trim()) {
      instructions = customInstructionsPrompt.trim();
    }
  }

  s.start('Generating README with mdfmt AI engine...');

  const result = await generateReadme(snapshot, {
    projectName: snapshot.repo,
    documentationDepth: docDepth,
    instructions,
    groqApiKey: flags.groqKey,
    serverUrl: flags.serverUrl,
    offline: flags.offline
  });

  s.stop(
    result.isFallback
      ? picocolors.yellow('Generated using local template engine (Offline Mode)')
      : picocolors.green('Successfully generated with mdfmt AI Service!')
  );

  const targetFile = flags.output || 'README.md';
  const outputPath = path.resolve(rootDir, targetFile);
  const fileExists = await fs.pathExists(outputPath);

  if (fileExists && !flags.yes) {
    const existingContent = await fs.readFile(outputPath, 'utf-8');
    showTerminalDiff(existingContent, result.readme);

    const shouldOverwrite = await confirm({
      message: `File ${picocolors.bold(targetFile)} already exists. Overwrite?`
    });

    if (isCancel(shouldOverwrite) || !shouldOverwrite) {
      outro(picocolors.yellow('Operation cancelled. Your existing README was left untouched.'));
      return;
    }
  }

  await fs.ensureDir(path.dirname(outputPath));
  await fs.writeFile(outputPath, result.readme, 'utf-8');

  // If docs files were generated, write them out too
  if (result.docs && result.docs.length > 0) {
    for (const doc of result.docs) {
      const docPath = path.resolve(rootDir, doc.path);
      await fs.ensureDir(path.dirname(docPath));
      await fs.writeFile(docPath, doc.content, 'utf-8');
    }
  }

  outro(
    picocolors.green(
      `🎉 Successfully written to ${picocolors.bold(targetFile)}! Open it in VS Code to view your new README.`
    )
  );
}
