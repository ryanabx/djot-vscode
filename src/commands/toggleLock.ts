
import { Command } from '../commandManager';
import { DjotPreviewManager } from '../preview/previewManager';

export class ToggleLockCommand implements Command {
	public readonly id = 'djot.preview.toggleLock';

	public constructor(
		private readonly _previewManager: DjotPreviewManager
	) { }

	public execute() {
		this._previewManager.toggleLock();
	}
}
