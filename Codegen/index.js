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
const resourcesDestPath = path.join(sourcesDestPath, 'Resources', 'Assets.xcassets');

let uiImageCode = '';
let nsImageCode = '';
let swiftUICode = '';
let testCode = '';

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
  uiImageCode += `    public static let ${iconName} = UIImage(named: "${iconName}", in: Bundle.module, with: nil)!\n`;
  nsImageCode += `    public static let ${iconName} = Bundle.module.image(forResource: "${iconName}")!\n`;
  swiftUICode += `    public static var ${iconName}: Image { return Image("${iconName}", bundle: Bundle.module) }\n`;
  testCode += `        XCTAssertNotNil(FluentUIEmoji.${iconName}, "FluentUIEmoji.${iconName} should not be nil")\n`;
}

const code = fs.readFileSync(path.join(basePath, 'FluentUIEmoji-template.swift')).toString()
  .replace('    /// UIImage', uiImageCode)
  .replace('    /// NSImage', nsImageCode)
  .replace('    /// SwiftUI', swiftUICode);
fs.writeFileSync(path.join(sourcesDestPath, 'FluentUIEmoji.swift'), code);
const tests = fs.readFileSync(path.join(basePath, 'FluentUIEmojiTests-template.swift')).toString()
  .replace('        /// Test', testCode);
fs.writeFileSync(path.join(basePath, '..', 'Tests', 'FluentUIEmojiTests', 'FluentUIEmojiTests.swift'), tests);
console.log('Codegen complete!');
