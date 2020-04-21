import * as inquirer from 'inquirer';
import { Importer } from '../../types';
import { TrelloCsvImporter } from './TrelloCsvImporter';

const BASE_PATH = process.cwd();

export const trelloCsvImport = async (): Promise<Importer> => {
  const answers = await inquirer.prompt<TrelloImportAnswers>(questions);
  const trelloImporter = new TrelloCsvImporter(answers.trelloFilePath);
  return trelloImporter;
};

interface TrelloImportAnswers {
  trelloFilePath: string;
}

const questions = [
  {
    basePath: BASE_PATH,
    type: 'filePath',
    name: 'trelloFilePath',
    message: 'Select your exported CSV file of Trello boards',
  },
];
