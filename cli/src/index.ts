import { Command } from 'commander';
import dotenv from 'dotenv';
import { runGenerateCommand } from './commands/generate';

dotenv.config();

const program = new Command();

program
  .name('mdfmt')
  .description('mdfmt CLI — Modern AI-powered README & documentation generator for local repositories')
  .version('1.0.0');

program
  .command('generate', { isDefault: true })
  .description('Scan current workspace and generate a clean README.md')
  .option('-o, --output <filename>', 'Output file path', 'README.md')
  .option('-y, --yes', 'Skip interactive prompts and use defaults')
  .option('-i, --instructions <text>', 'Custom instructions for AI generator')
  .option('-s, --server <url>', 'mdfmt backend server URL')
  .option('-k, --groq-key <key>', 'Groq API Key for direct AI generation')
  .option('-l, --offline', 'Run standalone offline generator immediately (bypasses server)')
  .action(async (options) => {
    await runGenerateCommand({
      output: options.output,
      yes: options.yes,
      instructions: options.instructions,
      serverUrl: options.server,
      groqKey: options.groqKey,
      offline: options.offline
    });
  });

program
  .command('init')
  .description('Initialize mdfmt documentation wizard for this project')
  .action(async () => {
    await runGenerateCommand();
  });

program.parse(process.argv);
