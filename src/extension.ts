// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

import { DjotEngine } from './djotEngine';
import { CommandManager } from './commandManager';
import * as commands from './commands';

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	const djotEngine = new DjotEngine();

	const commandManager = new CommandManager();
	context.subscriptions.push(commandManager);

	commandManager.register(new commands.SaveHTML(djotEngine));

}

// This method is called when your extension is deactivated
export function deactivate() {}
