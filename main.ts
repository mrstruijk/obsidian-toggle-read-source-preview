import { Plugin, MarkdownView, WorkspaceLeaf, editorLivePreviewField } from 'obsidian';
import type { EditorView as CodeMirrorEditorView } from '@codemirror/view';

type ViewMode = 'reading' | 'live-preview' | 'source';

export default class Cyclist extends Plugin {
	private transition: Promise<void> | null = null;

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
			const editor = view.editor;
			if (!editor) return 'source';

			// The public Editor type does not expose the CodeMirror 6 EditorView.
			// This is the documented pattern: https://docs.obsidian.md/Plugins/Editor/Communicating+with+editor+extensions
			const cm: CodeMirrorEditorView | undefined = (editor as unknown as { cm?: CodeMirrorEditorView }).cm;
			if (!cm) return 'source';

			const isLivePreview = cm.state.field(editorLivePreviewField, false);
			return isLivePreview ? 'live-preview' : 'source';
		}

		// Defensive fallback: Obsidian currently only exposes 'preview' and 'source'.
		return 'source';
	}

	private getNextMode(current: ViewMode): ViewMode {
		const cycle: ViewMode[] = ['reading', 'live-preview', 'source'];
		const index = cycle.indexOf(current);
		return cycle[(index + 1) % cycle.length];
	}

	private async setViewMode(leaf: WorkspaceLeaf, mode: ViewMode): Promise<void> {
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

		await leaf.setViewState({ ...viewState, state: nextState });
	}

	private async cycleViewModes(): Promise<void> {
		const activeView = this.app.workspace.getActiveViewOfType(MarkdownView);
		if (!activeView) return;

		// Prevent rapid hotkey presses from overlapping transitions.
		if (this.transition) {
			await this.transition;
		}

		const currentMode = this.getCurrentMode(activeView);
		const nextMode = this.getNextMode(currentMode);

		const leaf = activeView.leaf;
		this.transition = this.setViewMode(leaf, nextMode);
		await this.transition;
		this.transition = null;
	}
}
