/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as vscode from 'vscode';
import { Command } from '../commandManager';
import { DjotPreviewManager } from '../preview/previewManager';

export class ShowSourceCommand implements Command {
	public readonly id = 'djot.showSource';

	public constructor(
		private readonly _previewManager: DjotPreviewManager
	) { }

	public execute() {
		const { activePreviewResource, activePreviewResourceColumn } = this._previewManager;
		if (activePreviewResource && activePreviewResourceColumn) {
			return vscode.workspace.openTextDocument(activePreviewResource).then(document => {
				return vscode.window.showTextDocument(document, activePreviewResourceColumn);
			});
		}
		return undefined;
	}
}
