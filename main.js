const vscode = require('vscode');
const fs = require('fs');
const path = require('path');

// Messages constants
const EXTENSION_ON_MESSAGE = "42-canonical-class-cpp \"ON\"";
const EXTENSION_OFF_MESSAGE = "42-canonical-class-cpp \"OFF\"";
const CLASS_NAME_PROMPT = 'Enter the name of the class';
const CLASS_NAME_PLACEHOLDER = 'ClassName';
const EMPTY_CLASS_NAME_ERROR = 'Class name cannot be empty';
const NO_WORKSPACE_ERROR = 'No workspace folder is open';

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
	console.log(EXTENSION_ON_MESSAGE);

	// Register the canonical command
	const disposable = vscode.commands.registerCommand("42-canonical-class-cpp.canonical", async function () {
		// Prompt the user for a class name
		const className = await promptClassName();
		if (!className) {
			vscode.window.showErrorMessage(EMPTY_CLASS_NAME_ERROR);
			return;
		}

		// Create the files in the workspace
		const workspaceFolders = vscode.workspace.workspaceFolders;
		if (workspaceFolders) {
			const rootPath = workspaceFolders[0].uri.fsPath;
			createFile(path.join(rootPath, `${className}.cpp`), generateCppContent(className), `${className}.cpp`);
			createFile(path.join(rootPath, `${className}.hpp`), generateHppContent(className), `${className}.hpp`);
		} else {
			vscode.window.showErrorMessage(NO_WORKSPACE_ERROR);
		}
	});

	context.subscriptions.push(disposable);
}

/**
 * Prompts the user to enter a class name.
 * @returns {Promise<string>} The class name entered by the user.
 */
async function promptClassName() {
	return await vscode.window.showInputBox({
		prompt: CLASS_NAME_PROMPT,
		placeHolder: CLASS_NAME_PLACEHOLDER
	});
}

/**
 * Generates the content for the .cpp file.
 * @param {string} className The name of the class.
 * @returns {string} The content for the .cpp file.
 */
function generateCppContent(className) {
	return `# include "${className}.hpp"

/*
** ------------------------------- CONSTRUCTOR --------------------------------
*/

${className}::${className}(void) {
}

${className}::${className}(const ${className} &other) {
}

/*
** ------------------------------- DESTRUCTOR ---------------------------------
*/

${className}::~${className}(void) {
}

/*
** --------------------------------- OVERLOAD ---------------------------------
*/

${className} &${className}::operator=(${className} const &srcs) {
	// if (this != &srcs) {
	// 
	// }
	return (*this);
}

std::ostream &operator<<(std::ostream &o, ${className} const &i) {
	// o << i.getName() << ".";
	return (o);
}

/*
** --------------------------------- METHODS ----------------------------------
*/

/*
** --------------------------------- ACCESSOR ---------------------------------
*/

/*
** --------------------------------- EXCEPTIONS -------------------------------
*/

/* ************************************************************************* */`;
}

/**
 * Generates the content for the .hpp file.
 * @param {string} className The name of the class.
 * @returns {string} The content for the .hpp file.
 */
function generateHppContent(className) {
	return `#ifndef ${className.toUpperCase()}_HPP
# define ${className.toUpperCase()}_HPP

# include <iostream>
# include <string>

class ${className} {
	private:
	
	public:
		${className}(void);
		${className}(const ${className} &other);
		~${className}(void);
		${className} &operator=(${className} const &rhs);
};

std::ostream &operator<<(std::ostream &o, ${className} const &i);

#endif /* ************************************************* ${className.toUpperCase()} */`;
}

/**
 * Creates a file with the given content.
 * @param {string} filePath The path of the file to create.
 * @param {string} content The content to write to the file.
 * @param {string} fileName The name of the file (for messages).
 */
function createFile(filePath, content, fileName) {
	fs.writeFile(filePath, content, (err) => {
		if (err) {
			vscode.window.showErrorMessage(`Failed to create ${fileName}`);
			return;
		}
		vscode.window.showInformationMessage(`${fileName} created successfully!`);
	});
}

/**
 * This method is called when your extension is deactivated
 */
function deactivate() {
	console.log(EXTENSION_OFF_MESSAGE);
}

module.exports = {
	activate,
	deactivate
};
