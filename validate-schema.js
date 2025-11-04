import fs from 'fs';
import path from 'path';
import Ajv from 'ajv';

const ajv = new Ajv({ allErrors: true });
const schema = JSON.parse(fs.readFileSync('schema.json', 'utf8'));
const validate = ajv.compile(schema);

// If a file is passed as argument, validate only that file
const fileArg = process.argv[2];
if (fileArg) {
  // Validate single file
  try {
    const data = JSON.parse(fs.readFileSync(fileArg, 'utf8'));
    const valid = validate(data);
    if (!valid) {
      console.error(`Validation errors in ${fileArg}:`);
      console.error(validate.errors);
      process.exit(1);
    } else {
      console.log(`${fileArg} is valid`);
    }
  } catch (err) {
    console.error(`Error parsing ${fileArg}:`, err.message);
    process.exit(1);
  }
} else {
  // Validate all files in data/
  function validateJsonFiles(dir) {
    const files = fs.readdirSync(dir);
    let hasErrors = false;

    for (const file of files) {
      const filePath = path.join(dir, file);
      const stat = fs.statSync(filePath);

      if (stat.isDirectory()) {
        if (validateJsonFiles(filePath)) hasErrors = true;
      } else if (file.endsWith('.json')) {
        try {
          const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
          const valid = validate(data);
          if (!valid) {
            console.error(`Validation errors in ${filePath}:`);
            console.error(validate.errors);
            hasErrors = true;
          }
        } catch (err) {
          console.error(`Error parsing ${filePath}:`, err.message);
          hasErrors = true;
        }
      }
    }

    return hasErrors;
  }

  if (validateJsonFiles('data')) {
    console.error('Schema validation failed');
    process.exit(1);
  } else {
    console.log('All JSON files are valid');
  }
}
