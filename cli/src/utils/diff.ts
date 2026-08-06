import picocolors from 'picocolors';

export function showTerminalDiff(oldContent: string, newContent: string) {
  const oldLines = oldContent.split(/\r?\n/);
  const newLines = newContent.split(/\r?\n/);

  console.log('\n' + picocolors.bold(picocolors.cyan('--- Diff Preview (First 20 Line Changes) ---')));

  let changesCount = 0;
  const maxLineCheck = Math.max(oldLines.length, newLines.length);

  for (let i = 0; i < maxLineCheck; i++) {
    if (changesCount >= 20) {
      console.log(picocolors.dim('... [more changes omitted]'));
      break;
    }

    const oldLine = oldLines[i];
    const newLine = newLines[i];

    if (oldLine !== newLine) {
      if (oldLine !== undefined) {
        console.log(picocolors.red(`- L${i + 1}: ${oldLine}`));
        changesCount++;
      }
      if (newLine !== undefined) {
        console.log(picocolors.green(`+ L${i + 1}: ${newLine}`));
        changesCount++;
      }
    }
  }

  console.log(picocolors.bold(picocolors.cyan('--------------------------------------------\n')));
}
