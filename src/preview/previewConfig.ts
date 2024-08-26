/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as vscode from 'vscode';
import { equals } from '../util/arrays';

export class DjotPreviewConfiguration {
	public static getForResource(resource: vscode.Uri | null) {
		return new DjotPreviewConfiguration(resource);
	}

	public readonly scrollBeyondLastLine: boolean;
	public readonly wordWrap: boolean;

	public readonly previewLineBreaks: boolean;
	public readonly previewLinkify: boolean;
	public readonly previewTypographer: boolean;

	public readonly doubleClickToSwitchToEditor: boolean;
	public readonly scrollEditorWithPreview: boolean;
	public readonly scrollPreviewWithEditor: boolean;
	public readonly markEditorSelection: boolean;

	public readonly lineHeight: number;
	public readonly fontSize: number;
	public readonly fontFamily: string | undefined;
	public readonly styles: readonly string[];

	private constructor(resource: vscode.Uri | null) {
		const editorConfig = vscode.workspace.getConfiguration('editor', resource);
		const djotConfig = vscode.workspace.getConfiguration('djot', resource);
		const djotEditorConfig = vscode.workspace.getConfiguration('[djot]', resource);

		this.scrollBeyondLastLine = editorConfig.get<boolean>('scrollBeyondLastLine', false);

		this.wordWrap = editorConfig.get<string>('wordWrap', 'off') !== 'off';
		if (djotEditorConfig && djotEditorConfig['editor.wordWrap']) {
			this.wordWrap = djotEditorConfig['editor.wordWrap'] !== 'off';
		}

		this.scrollPreviewWithEditor = !!djotConfig.get<boolean>('preview.scrollPreviewWithEditor', true);
		this.scrollEditorWithPreview = !!djotConfig.get<boolean>('preview.scrollEditorWithPreview', true);

		this.previewLineBreaks = !!djotConfig.get<boolean>('preview.breaks', false);
		this.previewLinkify = !!djotConfig.get<boolean>('preview.linkify', true);
		this.previewTypographer = !!djotConfig.get<boolean>('preview.typographer', false);

		this.doubleClickToSwitchToEditor = !!djotConfig.get<boolean>('preview.doubleClickToSwitchToEditor', true);
		this.markEditorSelection = !!djotConfig.get<boolean>('preview.markEditorSelection', true);

		this.fontFamily = djotConfig.get<string | undefined>('preview.fontFamily', undefined);
		this.fontSize = Math.max(8, +djotConfig.get<number>('preview.fontSize', NaN));
		this.lineHeight = Math.max(0.6, +djotConfig.get<number>('preview.lineHeight', NaN));

		this.styles = djotConfig.get<string[]>('styles', []);
	}

	public isEqualTo(otherConfig: DjotPreviewConfiguration) {
		for (const key in this) {
			if (this.hasOwnProperty(key) && key !== 'styles') {
				if (this[key] !== otherConfig[key]) {
					return false;
				}
			}
		}

		return equals(this.styles, otherConfig.styles);
	}

	readonly [key: string]: any;
}

export class DjotPreviewConfigurationManager {
	private readonly _previewConfigurationsForWorkspaces = new Map<string, DjotPreviewConfiguration>();

	public loadAndCacheConfiguration(
		resource: vscode.Uri
	): DjotPreviewConfiguration {
		const config = DjotPreviewConfiguration.getForResource(resource);
		this._previewConfigurationsForWorkspaces.set(this._getKey(resource), config);
		return config;
	}

	public hasConfigurationChanged(
		resource: vscode.Uri
	): boolean {
		const key = this._getKey(resource);
		const currentConfig = this._previewConfigurationsForWorkspaces.get(key);
		const newConfig = DjotPreviewConfiguration.getForResource(resource);
		return (!currentConfig || !currentConfig.isEqualTo(newConfig));
	}

	private _getKey(
		resource: vscode.Uri
	): string {
		const folder = vscode.workspace.getWorkspaceFolder(resource);
		return folder ? folder.uri.toString() : '';
	}
}
