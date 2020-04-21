import { Importer, ImportResult } from '../../types';
const csv = require('csvtojson');

interface TrelloCardType {
  'Card Name': string;
  'Card Description': string;
  Members: string;
  Labels: string;
  'Board Name': string;
  'List Name': string;
  'Card URL': string;
}

/**
 * Import issues from a Trello CSV export.
 *
 */
export class TrelloCsvImporter implements Importer {
  public constructor(filePath: string) {
    this.filePath = filePath;
  }

  public get name() {
    return 'Trello';
  }

  public get defaultTeamName() {
    return 'Trello';
  }

  public import = async (): Promise<ImportResult> => {
    const data = (await csv().fromFile(this.filePath)) as TrelloCardType[];

    const importData: ImportResult = {
      issues: [],
      labels: {},
      users: {},
      statuses: {},
    };

    const statuses = Array.from(new Set(data.map(row => row['List Name'])));
    const assignees = Array.from(new Set(data.map(row => row['Members'])));

    for (const user of assignees) {
      importData.users[user] = {
        name: user,
      };
    }
    for (const status of statuses) {
      importData.statuses![status] = {
        name: status,
      };
    }

    for (const row of data) {
      const url = row['Card URL'];
      const description = row['Card Description'];
      const assigneeId =
        row['Members'] && row['Members'].length > 0
          ? row['Members']
          : undefined;
      const status = row['List Name'];

      const priority = undefined;

      const labels = row['Labels']
        .replace(/\([^)]*\)/g, '')
        .split(',')
        .map(row => row.trim())
        .filter(item => !!item);

      importData.issues.push({
        title: row['Card Name'],
        description,
        status,
        priority,
        url,
        assigneeId,
        labels,
      });

      for (const lab of labels) {
        if (!importData.labels[lab]) {
          importData.labels[lab] = {
            name: lab,
          };
        }
      }
    }

    return importData;
  };

  // -- Private interface

  private filePath: string;
}
