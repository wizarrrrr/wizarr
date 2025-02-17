import process from "node:process";
import Colors, { Color, cyan } from "colors";
import cliCursor from "cli-cursor";
import cliSpinners, { Spinner, SpinnerName } from "cli-spinners";
import logSymbols from "log-symbols";
import stripAnsi from "strip-ansi";
import stringWidth from "string-width";
import isInteractive from "is-interactive";

const ASCII_ETX_CODE = 0x03; // Ctrl+C emits this code

class StdinDiscarder {
    #activeCount = 0;

    start() {
        this.#activeCount++;

        if (this.#activeCount === 1) {
            this.#realStart();
        }
    }

    stop() {
        if (this.#activeCount <= 0) {
            throw new Error("`stop` called more times than `start`");
        }

        this.#activeCount--;

        if (this.#activeCount === 0) {
            this.#realStop();
        }
    }

    #realStart() {
        // No known way to make it work reliably on Windows.
        if (process.platform === "win32" || !process.stdin.isTTY) {
            return;
        }

        process.stdin.setRawMode(true);
        process.stdin.on("data", this.#handleInput);
        process.stdin.resume();
    }

    #realStop() {
        if (!process.stdin.isTTY) {
            return;
        }

        process.stdin.off("data", this.#handleInput);
        process.stdin.pause();
        process.stdin.setRawMode(false);
    }

    #handleInput(chunk: Buffer) {
        // Allow Ctrl+C to gracefully exit.
        if (chunk[0] === ASCII_ETX_CODE) {
            process.emit("SIGINT");
        }
    }
}

const stdinDiscarder = new StdinDiscarder();

function isUnicodeSupported() {
    if (process.platform !== "win32") {
        return process.env.TERM !== "linux"; // Linux console (kernel)
    }

    return (
        Boolean(process.env.CI) ||
        Boolean(process.env.WT_SESSION) || // Windows Terminal
        Boolean(process.env.TERMINUS_SUBLIME) || // Terminus (<0.2.27)
        process.env.ConEmuTask === "{cmd::Cmder}" || // ConEmu and cmder
        process.env.TERM_PROGRAM === "Terminus-Sublime" ||
        process.env.TERM_PROGRAM === "vscode" ||
        process.env.TERM === "xterm-256color" ||
        process.env.TERM === "alacritty" ||
        process.env.TERMINAL_EMULATOR === "JetBrains-JediTerm"
    );
}

export type PrefixTextGenerator = () => string;

export type SuffixTextGenerator = () => string;

export type Options = {
    /**
	The text to display next to the spinner.
	*/
    readonly text?: string;

    /**
	Text or a function that returns text to display before the spinner. No prefix text will be displayed if set to an empty string.
	*/
    readonly prefixText?: string | PrefixTextGenerator;

    /**
	Text or a function that returns text to display after the spinner text. No suffix text will be displayed if set to an empty string.
	*/
    readonly suffixText?: string | SuffixTextGenerator;

    /**
	The name of one of the provided spinners. See [`example.js`](https://github.com/BendingBender/ora/blob/main/example.js) in this repo if you want to test out different spinners. On Windows (expect for Windows Terminal), it will always use the line spinner as the Windows command-line doesn't have proper Unicode support.

	@default 'dots'

	Or an object like:

	@example
	```
	{
		frames: ['-', '+', '-'],
		interval: 80 // Optional
	}
	```
	*/
    readonly spinner?: SpinnerName | Spinner;

    /**
	The color of the spinner.

	@default 'cyan'
	*/
    readonly color?: Color | string;

    /**
	Set to `false` to stop Ora from hiding the cursor.

	@default true
	*/
    readonly hideCursor?: boolean;

    /**
	Indent the spinner with the given number of spaces.

	@default 0
	*/
    readonly indent?: number;

    /**
	Interval between each frame.

	Spinners provide their own recommended interval, so you don't really need to specify this.

	Default: Provided by the spinner or `100`.
	*/
    readonly interval?: number;

    /**
	Stream to write the output.

	You could for example set this to `process.stdout` instead.

	@default process.stderr
	*/
    readonly stream?: NodeJS.WriteStream;

    /**
	Force enable/disable the spinner. If not specified, the spinner will be enabled if the `stream` is being run inside a TTY context (not spawned or piped) and/or not in a CI environment.

	Note that `{isEnabled: false}` doesn't mean it won't output anything. It just means it won't output the spinner, colors, and other ansi escape codes. It will still log text.
	*/
    readonly isEnabled?: boolean;

    /**
	Disable the spinner and all log text. All output is suppressed and `isEnabled` will be considered `false`.

	@default false
	*/
    readonly isSilent?: boolean;

    /**
	Discard stdin input (except Ctrl+C) while running if it's TTY. This prevents the spinner from twitching on input, outputting broken lines on `Enter` key presses, and prevents buffering of input while the spinner is running.

	This has no effect on Windows as there's no good way to implement discarding stdin properly there.

	@default true
	*/
    readonly discardStdin?: boolean;
};

export type PersistOptions = {
    /**
	Symbol to replace the spinner with.

	@default ' '
	*/
    readonly symbol?: string;

    /**
	Text to be persisted after the symbol.

	Default: Current `text`.
	*/
    readonly text?: string;

    /**
	Text or a function that returns text to be persisted before the symbol. No prefix text will be displayed if set to an empty string.

	Default: Current `prefixText`.
	*/
    readonly prefixText?: string | PrefixTextGenerator;

    /**
	Text or a function that returns text to be persisted after the text after the symbol. No suffix text will be displayed if set to an empty string.

	Default: Current `suffixText`.
	*/
    readonly suffixText?: string | SuffixTextGenerator;
};

export type PromiseOptions<T> = {
    /**
	The new text of the spinner when the promise is resolved.

	Keeps the existing text if `undefined`.
	*/
    successText?: string | ((result: T) => string) | undefined;

    /**
	The new text of the spinner when the promise is rejected.

	Keeps the existing text if `undefined`.
	*/
    failText?: string | ((error: Error) => string) | undefined;
} & Options;

class Ora {
    #linesToClear = 0;
    #isDiscardingStdin = false;
    #lineCount = 0;
    lastIndent = 0;
    #frameIndex = -1;
    #lastSpinnerFrameTime = 0;
    #options: Options;
    #spinner: Spinner = cliSpinners.dots;
    #stream: NodeJS.WriteStream = process.stderr;
    #id: NodeJS.Timeout | undefined;
    #initialInterval;
    #isEnabled;
    #isSilent;
    #indent = 0;
    #text: string | undefined;
    #prefixText: string | PrefixTextGenerator | undefined;
    #suffixText: string | SuffixTextGenerator | undefined;
    color: Color;

    constructor(options: Options | string) {
        if (typeof options === "string") {
            options = {
                text: options,
            };
        }

        this.#options = {
            color: cyan,
            stream: process.stderr,
            discardStdin: true,
            hideCursor: true,
            ...options,
        };

        // Public
        this.color = typeof this.#options.color === "string" ? (Colors as unknown as Record<string, Color>)[this.#options.color] : this.#options.color ?? cyan;

        // It's important that these use the public setters.
        this.spinner = typeof this.#options.spinner === "string" ? cliSpinners[this.#options.spinner] : this.#options.spinner ?? cliSpinners.dots;

        this.#initialInterval = this.#options.interval;
        this.#stream = this.#options.stream ?? process.stderr;
        this.#isEnabled = typeof this.#options.isEnabled === "boolean" ? this.#options.isEnabled : isInteractive({ stream: this.#stream });
        this.#isSilent = typeof this.#options.isSilent === "boolean" ? this.#options.isSilent : false;

        // Set *after* `this.#stream`.
        // It's important that these use the public setters.
        this.text = this.#options.text;
        this.prefixText = this.#options.prefixText;
        this.suffixText = this.#options.suffixText;
        this.indent = this.#options.indent ?? 0;
    }

    get indent() {
        return this.#indent;
    }

    set indent(indent) {
        indent = indent ?? 0;
        if (!(indent >= 0 && Number.isInteger(indent))) {
            throw new Error("The `indent` option must be an integer from 0 and up");
        }

        this.#indent = indent;
        this.#updateLineCount();
    }

    get interval() {
        return this.#initialInterval ?? (this.#spinner as Spinner)?.interval ?? 100;
    }

    get spinner() {
        return this.#spinner;
    }

    set spinner(spinner) {
        this.#frameIndex = -1;
        this.#initialInterval = undefined;

        if (typeof spinner === "object") {
            if (spinner.frames === undefined) {
                throw new Error("The given spinner must have a `frames` property");
            }

            this.#spinner = spinner;
        } else if (!isUnicodeSupported()) {
            this.#spinner = cliSpinners.line;
        } else if (spinner === undefined) {
            // Set default spinner
            this.#spinner = cliSpinners.dots;
        } else if (cliSpinners[spinner]) {
            this.#spinner = cliSpinners[spinner];
        } else {
            throw new Error(`There is no built-in spinner named '${spinner}'. See https://github.com/sindresorhus/cli-spinners/blob/main/spinners.json for a full list.`);
        }
    }

    get text(): string | undefined {
        return this.#text;
    }

    set text(value: string | undefined) {
        this.#text = value;
        this.#updateLineCount();
    }

    get prefixText(): string | PrefixTextGenerator | undefined {
        return this.#prefixText;
    }

    set prefixText(value: string | PrefixTextGenerator | undefined) {
        this.#prefixText = value;
        this.#updateLineCount();
    }

    get suffixText(): string | SuffixTextGenerator | undefined {
        return this.#suffixText;
    }

    set suffixText(value: string | SuffixTextGenerator | undefined) {
        this.#suffixText = value;
        this.#updateLineCount();
    }

    get isSpinning() {
        return this.#id !== undefined;
    }

    #getFullPrefixText(prefixText = this.#prefixText, postfix = " ") {
        if (typeof prefixText === "string" && prefixText !== "") {
            return prefixText + postfix;
        }

        if (typeof prefixText === "function") {
            return prefixText() + postfix;
        }

        return "";
    }

    #getFullSuffixText(suffixText = this.#suffixText, prefix = " ") {
        if (typeof suffixText === "string" && suffixText !== "") {
            return prefix + suffixText;
        }

        if (typeof suffixText === "function") {
            return prefix + suffixText();
        }

        return "";
    }

    #updateLineCount() {
        const columns = process.stdout.columns ?? 80;
        const fullPrefixText = this.#getFullPrefixText(this.#prefixText, "-");
        const fullSuffixText = this.#getFullSuffixText(this.#suffixText, "-");
        const fullText = " ".repeat(this.#indent ?? 0) + fullPrefixText + "--" + this.#text + "--" + fullSuffixText;

        this.#lineCount = 0;
        for (const line of stripAnsi(fullText).split("\n")) {
            this.#lineCount += Math.max(1, Math.ceil(stringWidth(line) / columns));
        }
    }

    get isEnabled() {
        return this.#isEnabled && !this.#isSilent;
    }

    set isEnabled(value) {
        if (typeof value !== "boolean") {
            throw new TypeError("The `isEnabled` option must be a boolean");
        }

        this.#isEnabled = value;
    }

    get isSilent() {
        return this.#isSilent;
    }

    set isSilent(value) {
        if (typeof value !== "boolean") {
            throw new TypeError("The `isSilent` option must be a boolean");
        }

        this.#isSilent = value;
    }

    public frame() {
        // Ensure we only update the spinner frame at the wanted interval,
        // even if the render method is called more often.
        const now = Date.now();
        if (this.#frameIndex === -1 || now - this.#lastSpinnerFrameTime >= this.interval) {
            this.#frameIndex = ++this.#frameIndex % this.#spinner.frames.length;
            this.#lastSpinnerFrameTime = now;
        }

        const { frames } = this.#spinner;
        let frame = frames[this.#frameIndex];

        if (this.color) {
            frame = this.color(frame);
        }

        const fullPrefixText = typeof this.#prefixText === "string" && this.#prefixText !== "" ? this.#prefixText + " " : "";
        const fullText = typeof this.text === "string" ? " " + this.text : "";
        const fullSuffixText = typeof this.#suffixText === "string" && this.#suffixText !== "" ? " " + this.#suffixText : "";

        return fullPrefixText + frame + fullText + fullSuffixText;
    }

    public clear() {
        if (!this.#isEnabled || !this.#stream.isTTY) {
            return this;
        }

        for (let index = 0; index < this.#linesToClear; index++) {
            if (index > 0) {
                this.#stream.moveCursor(0, -1);
            }

            this.#stream.clearLine(1);
        }

        if (this.#indent || this.lastIndent !== this.#indent) {
            this.#stream.cursorTo(this.#indent ?? 0);
        }

        this.lastIndent = this.#indent ?? 0;
        this.#linesToClear = 0;

        return this;
    }

    public render() {
        if (this.#isSilent) {
            return this;
        }

        this.clear();
        this.#stream.write(this.frame());
        this.#linesToClear = this.#lineCount;

        return this;
    }

    public start(text?: string) {
        if (text) {
            this.text = text;
        }

        if (this.#isSilent) {
            return this;
        }

        if (!this.#isEnabled) {
            if (this.text) {
                this.#stream.write(`- ${this.text}\n`);
            }

            return this;
        }

        if (this.isSpinning) {
            return this;
        }

        if (this.#options.hideCursor) {
            cliCursor.hide(this.#stream);
        }

        if (this.#options.discardStdin && process.stdin.isTTY) {
            this.#isDiscardingStdin = true;
            stdinDiscarder.start();
        }

        this.render();
        this.#id = setInterval(this.render.bind(this), this.interval);

        return this;
    }

    stop() {
        if (!this.#isEnabled) {
            return this;
        }

        clearInterval(this.#id);
        this.#id = undefined;
        this.#frameIndex = 0;
        this.clear();
        if (this.#options.hideCursor) {
            cliCursor.show(this.#stream);
        }

        if (this.#options.discardStdin && process.stdin.isTTY && this.#isDiscardingStdin) {
            stdinDiscarder.stop();
            this.#isDiscardingStdin = false;
        }

        return this;
    }

    succeed(text: string) {
        return this.stopAndPersist({ symbol: logSymbols.success, text });
    }

    fail(text: string) {
        return this.stopAndPersist({ symbol: logSymbols.error, text });
    }

    warn(text: string) {
        return this.stopAndPersist({ symbol: logSymbols.warning, text });
    }

    info(text: string) {
        return this.stopAndPersist({ symbol: logSymbols.info, text });
    }

    stopAndPersist(options: PersistOptions = {}) {
        if (this.#isSilent) {
            return this;
        }

        const prefixText = options.prefixText ?? this.#prefixText;
        const fullPrefixText = this.#getFullPrefixText(prefixText, " ");

        const symbolText = options.symbol ?? " ";

        const text = options.text ?? this.text;
        const separatorText = symbolText ? " " : "";
        const fullText = typeof text === "string" ? separatorText + text : "";

        const suffixText = options.suffixText ?? this.#suffixText;
        const fullSuffixText = this.#getFullSuffixText(suffixText, " ");

        const textToWrite = fullPrefixText + symbolText + fullText + fullSuffixText + "\n";

        this.stop();
        this.#stream.write(textToWrite);

        return this;
    }
}

export default function ora(options: Options | string): Ora {
    return new Ora(options);
}

export async function oraPromise<T>(action: (() => Promise<T>) | Promise<T>, options: PromiseOptions<T>): Promise<T> {
    const actionIsFunction = typeof action === "function";
    const actionIsPromise = action instanceof Promise;

    if (!actionIsFunction && !actionIsPromise) {
        throw new TypeError("Parameter `action` must be a Function or a Promise");
    }

    const { successText, failText } = typeof options === "object" ? options : { successText: undefined, failText: undefined };

    const spinner = ora(options).start();

    try {
        const promise = actionIsFunction ? (action as () => Promise<T>)() : (action as Promise<T>);
        const result = await promise;

        spinner.succeed(successText === undefined ? "" : typeof successText === "string" ? successText : successText(result));

        return result;
    } catch (error) {
        spinner.fail(failText === undefined ? "" : typeof failText === "string" ? failText : failText(error as Error));

        throw error;
    }
}

export { default as spinners } from "cli-spinners";
