/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as vscode from 'vscode';
import { CommandManager } from '../commandManager';
import { DjotEngine } from '../djotEngine';
import { DjotPreviewManager } from '../preview/previewManager';
import { ContentSecurityPolicyArbiter, PreviewSecuritySelector } from '../preview/security';
import { RefreshPreviewCommand } from './refreshPreview';
import { RenderDocument } from './renderDocument';
import { ShowLockedPreviewToSideCommand, ShowPreviewCommand, ShowPreviewToSideCommand } from './showPreview';
import { CopyImageCommand } from './copyImage';
import { ShowPreviewSecuritySelectorCommand } from './showPreviewSecuritySelector';
import { ShowSourceCommand } from './showSource';
import { ToggleLockCommand } from './toggleLock';
export { SaveHTMLCommand } from './saveHTML';

export function registerDjotCommands(
	commandManager: CommandManager,
	previewManager: DjotPreviewManager,
	cspArbiter: ContentSecurityPolicyArbiter,
	engine: DjotEngine,
): vscode.Disposable {
	const previewSecuritySelector = new PreviewSecuritySelector(cspArbiter, previewManager);
	commandManager.register(new CopyImageCommand(previewManager));
	commandManager.register(new ShowPreviewCommand(previewManager));
	commandManager.register(new ShowPreviewToSideCommand(previewManager));
	commandManager.register(new ShowLockedPreviewToSideCommand(previewManager));
	commandManager.register(new ShowSourceCommand(previewManager));
	commandManager.register(new RefreshPreviewCommand(previewManager, engine));
	commandManager.register(new ShowPreviewSecuritySelectorCommand(previewSecuritySelector, previewManager));
	commandManager.register(new ToggleLockCommand(previewManager));
	commandManager.register(new RenderDocument(engine));

	return commandManager;
}
