import { Plugin, MarkdownView, WorkspaceLeaf } from 'obsidian';

type ViewMode = 'reading' | 'live-preview' | 'source';

export default class Cyclist extends Plugin {
	onload() {
		this.addCommand({
			id: 'cycle-view-modes',
			name: 'Cycle view modes (reading / live preview / source)',
			callback: () => void this.cycleViewModes(),
		});
	}

	private getCurrentMode(view: MarkdownView): ViewMode {
		const mode = view.getMode();

		if (mode === 'preview') return 'reading';
		if (mode === 'source') {
			const state = view.getState();
			return state?.source === false ? 'live-preview' : 'source';
		}

		// Defensive fallback: Obsidian currently only exposes 'preview' and 'source'.
		return 'source';
	}

	private getNextMode(current: ViewMode): ViewMode {
		const cycle: ViewMode[] = ['reading', 'live-preview', 'source'];
		const index = cycle.indexOf(current);
		return cycle[(index + 1) % cycle.length];
	}

	private setViewMode(leaf: WorkspaceLeaf, mode: ViewMode) {
		const viewState = leaf.getViewState();

		if (viewState.type !== 'markdown') return;
		if (!viewState.state) return;

		const nextState = { ...viewState.state };

		switch (mode) {
			case 'reading':
				nextState.mode = 'preview';
				nextState.source = false;
				break;
			case 'live-preview':
				nextState.mode = 'source';
				nextState.source = false;
				break;
			case 'source':
				nextState.mode = 'source';
				nextState.source = true;
				break;
			default:
				return;
		}

		void leaf.setViewState({ ...viewState, state: nextState });
	}

	private cycleViewModes() {
		const activeView = this.app.workspace.getActiveViewOfType(MarkdownView);
		if (!activeView) return;

		const currentMode = this.getCurrentMode(activeView);
		const nextMode = this.getNextMode(currentMode);

		const leaf = activeView.leaf;
		void this.setViewMode(leaf, nextMode);
	}
}
