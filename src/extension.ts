// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

import { DjotEngine } from './djotEngine';
import { CommandManager } from './commandManager';
import * as commands from './commands';
import { VsCodeOutputLogger } from './logging';
import { DjDocumentRenderer } from './preview/documentRenderer';
import { DjotPreviewManager } from './preview/previewManager';
import { ExtensionContentSecurityPolicyArbiter } from './preview/security';


import { registerDjotCommands } from './commands/index';

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	const logger = new VsCodeOutputLogger();
	context.subscriptions.push(logger);

	const djotEngine = new DjotEngine();


	const commandManager = new CommandManager();
	context.subscriptions.push(commandManager);
	commandManager.register(new commands.SaveHTMLCommand(djotEngine));

	const cspArbiter = new ExtensionContentSecurityPolicyArbiter(context.globalState, context.workspaceState);
	const contentProvider = new DjDocumentRenderer(djotEngine, context, cspArbiter, logger);
	const previewManager = new DjotPreviewManager(contentProvider, logger);
	context.subscriptions.push(previewManager);

	context.subscriptions.push(registerDjotCommands(commandManager, previewManager, cspArbiter, djotEngine));

	context.subscriptions.push(vscode.workspace.onDidChangeConfiguration(() => {
		previewManager.updateConfiguration();
	}));
}

// This method is called when your extension is deactivated
export function deactivate() {}
