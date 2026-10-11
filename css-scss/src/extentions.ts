/// <reference types="node" />

import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';
import * as os from 'os';

const getCssToScssConverter = () => {
    try {
        // Avoid a hard TypeScript dependency on a local package path that may not exist yet.
        return require('../css-to-sass-converter/lib/converter.js') as {
            convertCssToScss: (inputFilePath: string, outputFilePath: string) => void;
        };
    } catch (error: any) {
        throw new Error(
            `Unable to load the CSS-to-SCSS converter. Ensure the local package exists at ../css-to-sass-converter/lib/converter.js. Original error: ${error.message}`
        );
    }
};

export function activate(context: vscode.ExtensionContext) {

    // 1. File Explorer Context Menu: Convert an entire .css file to .scss
    let fileDisposable = vscode.commands.registerCommand('sassify.convertFile', async (uri: vscode.Uri) => {
        const inputFilePath = uri ? uri.fsPath : vscode.window.activeTextEditor?.document.fileName;
        
        if (!inputFilePath || !inputFilePath.endsWith('.css')) {
            vscode.window.showWarningMessage('Please select a valid .css file.');
            return;
        }

        const outputFilePath = inputFilePath.replace(/\.css\$/, '.scss');

        try {
            convertCssToScss(inputFilePath, outputFilePath);
            vscode.window.showInformationMessage(`Converted: ${path.basename(inputFilePath)} → ${path.basename(outputFilePath)}`);
            
            // Automatically open the new .scss file
            const doc = await vscode.workspace.openTextDocument(outputFilePath);
            await vscode.window.showTextDocument(doc);
        } catch (error: any) {
            vscode.window.showErrorMessage(`Conversion failed: ${error.message}`);
        }
    });

    // 2. Editor Context Menu: Convert highlighted CSS selection using temp files
    let selectionDisposable = vscode.commands.registerCommand('sassify.convertSelection', async () => {
        const editor = vscode.window.activeTextEditor;
        if (!editor) return;

        const selection = editor.selection;
        const text = editor.document.getText(selection);
        if (!text) {
            vscode.window.showWarningMessage('Please highlight some CSS code first.');
            return;
        }

        const tmpDir = os.tmpdir();
        const inputFile = path.join(tmpDir, `input_${Date.now()}.css`);
        const outputFile = path.join(tmpDir, `output_${Date.now()}.scss`);

        try {
            // Write selection to a temp CSS file for your package to read
            fs.writeFileSync(inputFile, text, 'utf8');
            
            // Run your package function
            convertCssToScss(inputFile, outputFile);

            // Read the generated SCSS output and replace selection in VS Code
            if (fs.existsSync(outputFile)) {
                const result = fs.readFileSync(outputFile, 'utf8');
                editor.edit(editBuilder => {
                    editBuilder.replace(selection, result);
                });
                vscode.window.showInformationMessage('CSS successfully converted to SCSS!');
            }
        } catch (error: any) {
            vscode.window.showErrorMessage(`Conversion failed: ${error.message}`);
        } finally {
            // Clean up temporary files
            if (fs.existsSync(inputFile)) fs.unlinkSync(inputFile);
            if (fs.existsSync(outputFile)) fs.unlinkSync(outputFile);
        }
    });

    context.subscriptions.push(fileDisposable, selectionDisposable);
}

export function deactivate() {}