
const fs = require('fs/promises');
const path = require('path');
const dotenv = require('dotenv');
dotenv.config({ path: path.join(__dirname, '../.env') });

const LANG_NAMES = {
  'ar': 'Arabic',
  'de': 'German',
  'el': 'Greek',
  'en': 'English',
  'es': 'Spanish',
  'fi': 'Finnish',
  'fr': 'French',
  'it': 'Italian',
  'nl': 'Dutch',
  'pt': 'Portuguese',
  'ro': 'Romanian',
  'sk': 'Slovak',
  'sv': 'Swedish'
};

const DEFAULT_LANG_FILE = 'FR.json';
const LANG_DIR = path.join(__dirname, '../lang');

/**
 * @param {Record<string, string>} texts 
 * @param {string} targetLanguage 
 * @param {string} apiKey 
 * @returns {Promise<Record<string, string>>}
 */
async function translateBatchWithOpenAI(texts, targetLanguage, apiKey) {
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: 'gpt-4o',
      response_format: {
        type: "json_object"
      },
      messages: [
        {
          role: 'system',
          content: `You are a professional translator for the UI elements of a web application. 
The input is a JSON object where keys are IDs and values are text to translate. 
Translate the values to ${targetLanguage}. 
Return a JSON object with the same keys and translated values. 
Preserve any placeholder variables like {variable} or {{variable}} exactly as they appear.`
        },
        {
          role: 'user',
          content: JSON.stringify(texts)
        }
      ],
      temperature: 0.3
    })
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`OpenAI API error: ${response.statusText} - ${error}`);
  }

  const data = await response.json();
  try {
    const content = data.choices[0].message.content;
    return JSON.parse(content);
  } catch (e) {
    console.error("Failed to parse OpenAI response:", e);
    throw e;
  }
}

async function main() {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    console.error("Please set OPENAI_API_KEY environment variable");
    process.exit(1);
  }

  const sourcePath = path.join(LANG_DIR, DEFAULT_LANG_FILE);

  let sourceData;
  try {
    const sourceContent = await fs.readFile(sourcePath, 'utf-8');
    sourceData = JSON.parse(sourceContent);
  } catch (err) {
    console.error(`Failed to read source language file ${DEFAULT_LANG_FILE}:`, err);
    process.exit(1);
  }

  console.log(`Loaded source language from ${DEFAULT_LANG_FILE}`);

  const files = await fs.readdir(LANG_DIR);
  const targetFiles = files.filter(f => f.endsWith('.json') && f !== DEFAULT_LANG_FILE);

  for (const file of targetFiles) {
    const langCode = path.parse(file).name.toLowerCase();
    const langName = LANG_NAMES[langCode] || langCode;

    console.log(`\nChecking language file: ${file} (${langName})`);

    const filePath = path.join(LANG_DIR, file);
    let targetData = {};
    try {
      const content = await fs.readFile(filePath, 'utf-8');
      targetData = JSON.parse(content);
    } catch (e) {
      console.warn(`  Could not parse ${file}, starting with empty object.`);
    }

    const missingKeys = {};
    for (const [key, val] of Object.entries(sourceData)) {
      if (!targetData[key]) {
        missingKeys[key] = val;
      }
    }

    const missingEntries = Object.entries(missingKeys);
    if (missingEntries.length > 0) {
      console.log(`  [${file}] Found ${missingEntries.length} missing translations.`);

      // Batch processing
      const BATCH_SIZE = 50;
      let langUpdated = 0;

      for (let i = 0; i < missingEntries.length; i += BATCH_SIZE) {
        const batch = missingEntries.slice(i, i + BATCH_SIZE);
        const batchObj = {};
        batch.forEach(([k, v]) => batchObj[k] = v);

        console.log(`  [${file}] Translating batch ${Math.floor(i / BATCH_SIZE) + 1}/${Math.ceil(missingEntries.length / BATCH_SIZE)}...`);

        try {
          const translatedBatch = await translateBatchWithOpenAI(batchObj, langName, apiKey);

          for (const [key, translatedText] of Object.entries(translatedBatch)) {
            if (translatedText) {
              targetData[key] = translatedText;
              langUpdated++;
            }
          }
        } catch (e) {
          console.error(`  Failed to translate batch for ${file}:`, e);
        }
      }

      if (langUpdated > 0) {
        await fs.writeFile(filePath, JSON.stringify(targetData, null, 2), 'utf-8');
        console.log(`  ✅ Added ${langUpdated} translations to ${file}. Saved.`);
      }

    } else {
      console.log(`  No missing translations for ${file}.`);
    }
  }

  console.log("\nDone.");
}

main().catch(console.error);
