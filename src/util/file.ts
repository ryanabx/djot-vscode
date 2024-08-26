
import * as vscode from 'vscode';
import * as URI from 'vscode-uri';
import { Schemes } from './schemes';

export const djotFileExtensions = Object.freeze<string[]>([
	'dj',
	'djot',
]);

export function isDjotFile(document: vscode.TextDocument) {
	return document.languageId === 'djot';
}

export function looksLikeDjotPath(resolvedHrefPath: vscode.Uri): boolean {
	const doc = vscode.workspace.textDocuments.find(doc => doc.uri.toString() === resolvedHrefPath.toString());
	if (doc) {
		return isDjotFile(doc);
	}

	if (resolvedHrefPath.scheme === Schemes.notebookCell) {
		for (const notebook of vscode.workspace.notebookDocuments) {
			for (const cell of notebook.getCells()) {
				if (cell.kind === vscode.NotebookCellKind.Markup && isDjotFile(cell.document)) {
					return true;
				}
			}
		}
		return false;
	}

	return djotFileExtensions.includes(URI.Utils.extname(resolvedHrefPath).toLowerCase().replace('.', ''));
}
