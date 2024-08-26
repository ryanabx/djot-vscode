
import { Command } from '../commandManager';
import { DjotEngine } from '../djotEngine';
import { DjotPreviewManager } from '../preview/previewManager';

export class RefreshPreviewCommand implements Command {
	public readonly id = 'djot.preview.refresh';

	public constructor(
		private readonly _webviewManager: DjotPreviewManager,
		private readonly _engine: DjotEngine
	) { }

	public execute() {
		// this._engine.cleanCache();
		this._webviewManager.refresh();
	}
}
