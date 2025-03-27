const fs = require('fs');
const path = require('path');
const glob = require('glob');

const translationFilePath = path.join(__dirname, 'lang/FR.json');
const editedTranslationFilePath = path.join(__dirname, 'lang/FR.edited.json');
const componentsDir = path.join(__dirname, 'components');
const pagesDir = path.join(__dirname, 'pages');

let translations = JSON.parse(fs.readFileSync(translationFilePath, 'utf8'));

const componentFiles = glob.sync(path.join(componentsDir, '**/*.{js,vue}'));
const pageFiles = glob.sync(path.join(pagesDir, '**/*.{js,vue}'));
const filesToSearch = [...componentFiles, ...pageFiles];

function isKeyUsed(key) {
  // Échapper les caractères spéciaux dans la clé pour la regex
  const escapedKey = key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

  // Regex pour trouver $t('key') ou $t("key")
  const regex = new RegExp(`\\$t\\(\\s*['"]${escapedKey}['"]\\s*\\)`);

  // Alternative regex pour trouver :label="$t('key')" ou autres attributs
  const attrRegex = new RegExp(`\\$t\\(['"]${escapedKey}['"]\\)`);

  for (const file of filesToSearch) {
    const content = fs.readFileSync(file, 'utf8');
    if (regex.test(content) || attrRegex.test(content)) {
      return true;
    }
  }
  return false;
}

const unusedKeys = [];
let counter = 0;

console.log('Searching for unused translation keys...');

for (const key in translations) {
  if (!isKeyUsed(key)) {
    unusedKeys.push(key);
    console.log(`Removing unused key: ${key}`);
    delete translations[key];
    counter++;
  }
}

fs.writeFileSync(editedTranslationFilePath, JSON.stringify(translations, null, 2), 'utf8');

console.log(`\nRemoved ${counter} unused keys.`);
console.log('Unused keys have been written to:', editedTranslationFilePath);

// Écrire les clés non utilisées dans un fichier séparé pour référence
fs.writeFileSync(
  path.join(__dirname, 'unused_translation_keys.json'),
  JSON.stringify(unusedKeys, null, 2),
  'utf8'
);
console.log('List of unused keys saved to: unused_translation_keys.json');