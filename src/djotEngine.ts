import * as vscode from 'vscode';
import * as djot from '@djot/djot';
import { ITextDocument } from './types/textDocument';
import { WebviewResourceProvider } from './util/resources';

export class DjotEngine {
	public async export(
		textDocument: vscode.TextDocument,
	): Promise<{ output: string }> {

		const output = djot.renderHTML(djot.parse(textDocument.getText(), { sourcePositions: true }));
		return {
			output,
		};
	}

	public async render(input: ITextDocument | string, resourceProvider?: WebviewResourceProvider): Promise<RenderOutput> {

		const text = typeof input === 'string'
			? input
			: input.getText();

		const html = djot.renderHTML(djot.parse(text, { sourcePositions: true }));
		console.log("Rendered {}", html);
		return {
			html,
		};
	}
}

export interface RenderOutput {
	html: string;
}
