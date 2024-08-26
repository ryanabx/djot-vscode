
import * as vscode from 'vscode';
import * as arrays from './util/arrays';
import { Disposable } from './util/dispose';

function resolveExtensionResource(extension: vscode.Extension<any>, resourcePath: string): vscode.Uri {
	return vscode.Uri.joinPath(extension.extensionUri, resourcePath);
}

function* resolveExtensionResources(extension: vscode.Extension<any>, resourcePaths: unknown): Iterable<vscode.Uri> {
	if (Array.isArray(resourcePaths)) {
		for (const resource of resourcePaths) {
			try {
				yield resolveExtensionResource(extension, resource);
			} catch {
				// noop
			}
		}
	}
}

export interface DjotContributions {
	readonly previewScripts: readonly vscode.Uri[];
	readonly previewStyles: readonly vscode.Uri[];
	readonly previewResourceRoots: readonly vscode.Uri[];
}

export namespace DjotContributions {
	export const Empty: DjotContributions = {
		previewScripts: [],
		previewStyles: [],
		previewResourceRoots: [],
	};

	export function merge(a: DjotContributions, b: DjotContributions): DjotContributions {
		return {
			previewScripts: [...a.previewScripts, ...b.previewScripts],
			previewStyles: [...a.previewStyles, ...b.previewStyles],
			previewResourceRoots: [...a.previewResourceRoots, ...b.previewResourceRoots],
		};
	}

	function uriEqual(a: vscode.Uri, b: vscode.Uri): boolean {
		return a.toString() === b.toString();
	}

	export function equal(a: DjotContributions, b: DjotContributions): boolean {
		return arrays.equals(a.previewScripts, b.previewScripts, uriEqual)
			&& arrays.equals(a.previewStyles, b.previewStyles, uriEqual)
			&& arrays.equals(a.previewResourceRoots, b.previewResourceRoots, uriEqual);
	}

	export function fromExtension(extension: vscode.Extension<any>): DjotContributions {
		const contributions = extension.packageJSON?.contributes;
		if (!contributions) {
			return DjotContributions.Empty;
		}

		const previewStyles = Array.from(getContributedStyles(contributions, extension));
		const previewScripts = Array.from(getContributedScripts(contributions, extension));
		const previewResourceRoots = previewStyles.length || previewScripts.length ? [extension.extensionUri] : [];

		return {
			previewScripts,
			previewStyles,
			previewResourceRoots,
		};
	}

	function getContributedScripts(
		contributes: any,
		extension: vscode.Extension<any>
	) {
		return resolveExtensionResources(extension, contributes['djot.previewScripts']);
	}

	function getContributedStyles(
		contributes: any,
		extension: vscode.Extension<any>
	) {
		return resolveExtensionResources(extension, contributes['djot.previewStyles']);
	}
}

export interface DjotContributionProvider {
	readonly extensionUri: vscode.Uri;

	readonly contributions: DjotContributions;
	readonly onContributionsChanged: vscode.Event<this>;

	dispose(): void;
}

class VSCodeExtensionDjotContributionProvider extends Disposable implements DjotContributionProvider {

	private _contributions?: DjotContributions;

	public constructor(
		private readonly _extensionContext: vscode.ExtensionContext,
	) {
		super();

		this._register(vscode.extensions.onDidChange(() => {
			const currentContributions = this._getCurrentContributions();
			const existingContributions = this._contributions || DjotContributions.Empty;
			if (!DjotContributions.equal(existingContributions, currentContributions)) {
				this._contributions = currentContributions;
				this._onContributionsChanged.fire(this);
			}
		}));
	}

	public get extensionUri() {
		return this._extensionContext.extensionUri;
	}

	private readonly _onContributionsChanged = this._register(new vscode.EventEmitter<this>());
	public readonly onContributionsChanged = this._onContributionsChanged.event;

	public get contributions(): DjotContributions {
		this._contributions ??= this._getCurrentContributions();
		return this._contributions;
	}

	private _getCurrentContributions(): DjotContributions {
		return vscode.extensions.all
			.map(DjotContributions.fromExtension)
			.reduce(DjotContributions.merge, DjotContributions.Empty);
	}
}

export function getDjotExtensionContributions(context: vscode.ExtensionContext): DjotContributionProvider {
	return new VSCodeExtensionDjotContributionProvider(context);
}
