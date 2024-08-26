
import * as vscode from 'vscode';
import { Command } from '../commandManager';
import { DjotPreviewManager } from '../preview/previewManager';

export class CopyImageCommand implements Command {
	public readonly id = '_djot.copyImage';

	public constructor(
		private readonly _webviewManager: DjotPreviewManager,
	) { }

	public execute(args: { id: string; resource: string }) {
		const source = vscode.Uri.parse(args.resource);
		this._webviewManager.findPreview(source)?.copyImage(args.id);
	}
}
