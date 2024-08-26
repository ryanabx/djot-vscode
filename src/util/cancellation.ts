
import * as vscode from 'vscode';

export const noopToken: vscode.CancellationToken = new class implements vscode.CancellationToken {
	private readonly _onCancellationRequestedEmitter = new vscode.EventEmitter<void>();
	onCancellationRequested = this._onCancellationRequestedEmitter.event;

	get isCancellationRequested() { return false; }
};
