import * as vscode from "vscode";

export function activate(context: vscode.ExtensionContext) {
	const provider = vscode.languages.registerHoverProvider(
		{ language: "eiga" },
		{
			provideHover(document, position) {
				const range = document.getWordRangeAtPosition(position);
				if (!range) return;

				const word = document.getText(range);

				const docs: Record<string, string> = {
					"call": "`call(func_name: String, arg1, arg2, ...)`\n\nGDScript側の関数を呼びます。",
					"pause": "`pause()`\n\nクリック待ちします。",
					"wait": "`wait(time: float)`\n\n指定時間待機します。"
				};

				const text = docs[word];
				if (!text) {
					const line = document.lineAt(position).text;
					const lineStart = new vscode.Position(range.start.line, 0);
					const lineRange =  new vscode.Range(lineStart, range.end);
					if (line.includes("@")) {
						return new vscode.Hover("話者の切り替えを行います。", lineRange);
					}else if (line.includes("->")) {
						return new vscode.Hover("シーン遷移のイベントを起こします。", lineRange);
					}
				}

				return new vscode.Hover(text, range);
			}
		}
	);

	context.subscriptions.push(provider);
}

export function deactivate() {}