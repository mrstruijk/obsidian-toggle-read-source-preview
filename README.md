# Cyclist

A simple plugin that adds a command and a hotkey to cycle the **active Markdown editor** through **Reading**, **Live Preview**, and **Source**.

## Usage

### Via command palette

Search for **"Cycle view modes (reading / live preview / source)"**.

### Via hotkey

Set a hotkey in **Obsidian Settings → Hotkeys**.

### Via GUI button

Add a button with [Commander](https://github.com/phibr0/obsidian-commander), for example in the tab bar:

1. Obsidian Settings → Community Plugins → Commander → Tab Bar
2. Add command → Search for **"Cycle view modes (reading / live preview / source)"**
3. Choose an icon → Save

## Optional CSS snippet

Hide the default Reading / Live Preview switch in the tab bar:

```css
/*
hide-read-livepreview-button.css

Provided by Anwan: https://forum.obsidian.md/t/how-can-i-hide-the-read-edit-switch-button-on-the-title-bar/75925
*/

.clickable-icon.view-action[aria-label^="Current view"] {
    display: none !important;
}
```

Store this in `/PATH/TO/YOUR_OBSIDIAN_VAULT/.obsidian/snippets/hide-read-livepreview-button.css` and enable it in **Obsidian Settings → Appearance → CSS snippets**.

## Contributions

Based on [Signynt's Editing Mode Hotkey](https://github.com/Signynt/obsidian-editing-mode-hotkey).

Please feel free to make or suggest any changes and improvements.
