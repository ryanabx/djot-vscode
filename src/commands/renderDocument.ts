/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Command } from '../commandManager';
import { DjotEngine } from '../djotEngine';
import { ITextDocument } from '../types/textDocument';

export class RenderDocument implements Command {
	public readonly id = 'djot.api.render';

	public constructor(
		private readonly _engine: DjotEngine
	) { }

	public async execute(document: ITextDocument | string): Promise<string> {
		return (await (this._engine.render(document))).html;
	}
}
