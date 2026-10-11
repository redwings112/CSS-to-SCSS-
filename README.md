Sassify - CSS to SCSS Extension for VS Code
Sassify is a lightweight, high-performance Visual Studio Code extension that automatically converts flat CSS files or highlighted code snippets into clean, structured SCSS.

Powered by your custom css-to-sass-converter npm package, this extension bridges command-line logic directly into your everyday developer workflow.

Features
File Explorer Conversion: Right-click any .css file in your sidebar and instantly generate a matching .scss file.

Selection Transformation: Highlight a specific CSS block in the editor, right-click, and convert it to SCSS on the fly.

Seamless Automation: Automatically handles input/output paths, file renaming, and opens the newly generated SCSS file instantly in your workspace.

Tech Stack
Editor: VS Code Extension API (TypeScript)

Bundler: esbuild for fast, optimized single-file distribution

Core Logic: css-to-sass-converter npm package

Installation & Local Setup
If you want to run or test this extension locally on your machine:

Clone the repository:

Bash
git clone [https://github.com/your-username/sassify-extension.git](https://github.com/redwings112/CSS-to-SCSS)
cd sassify-extension
Install dependencies:

Bash
npm install
Open in VS Code:

Bash
code .
Launch the Extension:

Press F5 to open a new Extension Development Host window.

Test the commands on any .css file or text selection!

Packaging for Local Distribution
To package the extension into a .vsix file for manual installation:

Bash
npm install -g @vscode/vsce
vsce package
You can then install the generated .vsix file directly into VS Code via the Extensions view (Ctrl+Shift+X / Cmd+Shift+X) by clicking the ... menu and selecting Install from VSIX....

License
Distributed under the MIT License. See LICENSE for more information.
