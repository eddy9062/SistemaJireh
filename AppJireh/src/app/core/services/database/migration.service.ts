import { Injectable } from '@angular/core';
import { version } from 'process';
import { environment } from 'src/environments/environment';
import { DatabaseService } from './database.service';
import { SQLiteService } from './sqlite.service';
import { Console } from 'console';


export const createSchemaOT: Array<string> = [
	`
	CREATE TABLE AF_ACTIVO (
		id  INTEGER NOT NULL,
		codigo_categoria INTEGER,
		correlativo INTEGER,
		nombre TEXT,
		createAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
		PRIMARY KEY(id)
	);
	`
];


@Injectable()
export class MigrationService {

	constructor(private databaseService: DatabaseService) { }

	async migrate(): Promise<any> {
		await this.createTableSchemaOt()
	}

	async createTableSchemaOt() {
		await this.databaseService.addUpgradeStatement(environment.databaseVersion, createSchemaOT).catch(err => {
			console.log(err);
		})
console.log('llege')
	}
}