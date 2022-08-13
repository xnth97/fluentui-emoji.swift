const fs = require('fs');
const path = require('path');
const process = require('process');
const { execSync } = require('child_process');
const { camelCase } = require('lodash');

const basePath = process.cwd();
const repoName = 'fluentui-emoji';

if (fs.existsSync(repoName)) {
  console.log('Repo exists. Pulling latest updates...');
  execSync(`cd ${repoName} && git pull --rebase`);
} else {
  console.log('Cloning Repo...');
  execSync('git clone https://github.com/microsoft/fluentui-emoji.git');
}

const hardcodeConvertion = {
  '1st place medal': 'goldMedal',
  '2nd place medal': 'silverMedal',
  '3rd place medal': 'bronzeMedal',
};
const sourcesDestPath = path.join(basePath, '..', 'Sources', 'FluentUIEmoji');
const resourcesDestPath = path.join(sourcesDestPath, 'Resources');

let uiImageCode = '';
let nsImageCode = '';

console.log('Iterating resources...');
const assetsPath = path.join(basePath, repoName, 'assets');
const dirs = fs.readdirSync(assetsPath);
for (const dir of dirs) {
  if (dir.startsWith('.')) {
    continue;
  }

  /**
   * @type {string}
   */
  let iconName;
  if (hardcodeConvertion[dir] !== undefined) {
    iconName = hardcodeConvertion[dir];
  } else {
    iconName = camelCase(dir);
  }
  
  const iconFolder = path.join(assetsPath, dir, '3D');
  if (!fs.existsSync(iconFolder)) {
    // No 3D icon.
    continue;
  }

  const iconFile = fs.readdirSync(iconFolder)[0];
  if (iconFile === undefined || !iconFile.endsWith('png')) {
    continue;
  }

  fs.cpSync(path.join(iconFolder, iconFile), path.join(resourcesDestPath, `${iconName}.png`));
  uiImageCode += `    public static let ${iconName}: UIImage = { return UIImage(contentsOfFile: getImagePath(name: "${iconName}"))! }()\n`;
  nsImageCode += `    public static let ${iconName}: NSImage = { return NSImage(contentsOfFile: getImagePath(name: "${iconName}"))! }()\n`;
}

const code = fs.readFileSync(path.join(basePath, 'FluentUIEmoji-template.swift')).toString()
  .replace('    /// UIImage', uiImageCode)
  .replace('    /// NSImage', nsImageCode)
fs.writeFileSync(path.join(sourcesDestPath, 'FluentUIEmoji.swift'), code);
console.log('Codegen complete!');
