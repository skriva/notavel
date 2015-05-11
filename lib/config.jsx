import path from 'path';
import fs from 'fs';


const HOME = process.env.HOME || process.env.HOMEPATH || process.env.USERPROFILE;

const CONFIG_PATH = path.join(HOME, '.notavel');
const NOTES_PATH = path.join(HOME, 'Dropbox/notavel-notes');
const NOTEBOOKS_PATH = path.join(NOTES_PATH, 'notebook');

const DEFAULT_CONFIG = `{
  "rootPath": "${NOTES_PATH}"
}`;

if (!fs.existsSync(CONFIG_PATH)) {
  fs.writeFileSync(CONFIG_PATH, DEFAULT_CONFIG);
}

if (!fs.existsSync(NOTES_PATH)) {
  fs.mkdirSync(NOTES_PATH);
  fs.mkdirSync(NOTEBOOKS_PATH);
}

const config = JSON.parse(fs.readFileSync(CONFIG_PATH));

export default config;