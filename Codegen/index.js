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
  'Guard': 'guardian',
};
const sourcesDestPath = path.join(basePath, '..', 'Sources', 'FluentUIEmoji');
const resourcesDestPath = path.join(sourcesDestPath, 'Resources', 'Assets.xcassets');

console.log('Cleaning up Assets.xcassets...');
fs.rmSync(resourcesDestPath, { recursive: true, force: true });
fs.mkdirSync(resourcesDestPath);

let imageCode = '';
let groupsCode = 'case unknown\n';
let testCode = '';

let groupSet = new Set(['unknown']);

/**
 * @type {Map<string, Array<string>>}
 */
let groupEmojiMap = {};

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
  
  let iconFolder = path.join(assetsPath, dir, '3D');
  if (!fs.existsSync(iconFolder)) {
    // No 3D icon, try default variant
    iconFolder = path.join(assetsPath, dir, 'Default', '3D');

    if (!fs.existsSync(iconFolder)) {
      continue;
    }
  }

  const iconFile = fs.readdirSync(iconFolder)[0];
  if (iconFile === undefined || !iconFile.endsWith('png')) {
    continue;
  }

  const metadataPath = path.join(assetsPath, dir, 'metadata.json');
  const metadata = JSON.parse(fs.readFileSync(metadataPath).toString());
  let group = 'unknown';
  if (metadata['group'] !== undefined) {
    group = camelCase(metadata['group'].replace('&', 'And'));
  }

  if (!groupSet.has(group)) {
    groupSet.add(group);
    groupsCode += `        case ${group}\n`;
  }

  const contentsMetadata = {
    "images" : [
      {
        "filename" : `${iconName}.png`,
        "idiom" : "universal"
      }
    ],
    "info" : {
      "author" : "xcode",
      "version" : 1
    }
  };

  const imagesetPath = path.join(resourcesDestPath, `${iconName}.imageset`);
  if (!fs.existsSync(imagesetPath)) {
    fs.mkdirSync(imagesetPath);
  }

  fs.cpSync(path.join(iconFolder, iconFile), path.join(imagesetPath, `${iconName}.png`));
  fs.writeFileSync(path.join(imagesetPath, 'Contents.json'), JSON.stringify(contentsMetadata, null, 4));
  imageCode += `    public static let ${iconName} = FluentUIEmoji(name: "${iconName}", group: .${group})\n`;
  testCode += `        XCTAssertNotNil(FluentUIEmoji.${iconName}.image, "FluentUIEmoji.${iconName} should not be nil")\n`;

  if (groupEmojiMap[group] === undefined) {
    groupEmojiMap[group] = [iconName];
  } else {
    groupEmojiMap[group].push(iconName);
  }
}

const code = fs.readFileSync(path.join(basePath, 'Emojis-template.swift')).toString()
  .replace('    /// Images', imageCode);
fs.writeFileSync(path.join(sourcesDestPath, 'Emojis.swift'), code);

let switchCode = '';
for (const key in groupEmojiMap) {
  switchCode += `        case .${key}:\n            return [${groupEmojiMap[key].map(iconName => `FluentUIEmoji.${iconName}`).join(', ')}]\n`;
}
const groups = fs.readFileSync(path.join(basePath, 'EmojiGroup-template.swift')).toString()
  .replace('case unknown\n', groupsCode)
  .replace('        /// Switch\n', switchCode);
fs.writeFileSync(path.join(sourcesDestPath, 'EmojiGroup.swift'), groups);

const tests = fs.readFileSync(path.join(basePath, 'FluentUIEmojiTests-template.swift')).toString()
  .replace('        /// Test', testCode);
fs.writeFileSync(path.join(basePath, '..', 'Tests', 'FluentUIEmojiTests', 'FluentUIEmojiTests.swift'), tests);

console.log('Codegen complete!');
