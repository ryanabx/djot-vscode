
import * as vscode from 'vscode';
import { Command } from '../commandManager';
import { DjotPreviewManager } from '../preview/previewManager';
import { PreviewSecuritySelector } from '../preview/security';
import { isDjotFile } from '../util/file';

export class ShowPreviewSecuritySelectorCommand implements Command {
	public readonly id = 'djot.showPreviewSecuritySelector';

	public constructor(
		private readonly _previewSecuritySelector: PreviewSecuritySelector,
		private readonly _previewManager: DjotPreviewManager
	) { }

	public execute(resource: string | undefined) {
		if (this._previewManager.activePreviewResource) {
			this._previewSecuritySelector.showSecuritySelectorForResource(this._previewManager.activePreviewResource);
		} else if (resource) {
			const source = vscode.Uri.parse(resource);
			this._previewSecuritySelector.showSecuritySelectorForResource(source.query ? vscode.Uri.parse(source.query) : source);
		} else if (vscode.window.activeTextEditor && isDjotFile(vscode.window.activeTextEditor.document)) {
			this._previewSecuritySelector.showSecuritySelectorForResource(vscode.window.activeTextEditor.document.uri);
		}
	}
}
