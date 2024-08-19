import * as vscode from 'vscode'
import * as djot from '@djot/djot'

export class DjotEngine {
    public async export (
        textDocument: vscode.TextDocument,
      ): Promise<{ output: string }> {
        
        const output = djot.renderHTML(djot.parse(textDocument.getText(),{sourcePositions:true}));
        return {
          output,
        }
      }
}