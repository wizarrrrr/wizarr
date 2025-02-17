import process from "node:process";
import colors from "colors";
import cliCursor from "cli-cursor";
import cliSpinners, { type SpinnerName } from "cli-spinners";
import logSymbols from "log-symbols";
import stripAnsi from "strip-ansi";
import stringWidth from "string-width";
import isInteractive from "is-interactive";

// Define types for better readability and maintainability
type Spinner = {
    readonly interval?: number;
    readonly frames: string[];
};

type Color = "black" | "red" | "green" | "yellow" | "blue" | "magenta" | "cyan" | "white" | "gray";

type PrefixTextGenerator = () => string;
type SuffixTextGenerator = () => string;

type Options = {
    readonly text?: string;
    readonly prefixText?: string | PrefixTextGenerator;
    readonly suffixText?: string | SuffixTextGenerator;
    readonly spinner?: SpinnerName | Spinner;
    readonly color?: Color;
    readonly hideCursor?: boolean;
    readonly indent?: number;
    readonly interval?: number;
    readonly stream?: NodeJS.WriteStream;
    readonly isEnabled?: boolean;
    readonly isSilent?: boolean;
    readonly discardStdin?: boolean;
};

type PersistOptions = {
    readonly symbol?: string;
    readonly text?: string;
    readonly prefixText?: string | PrefixTextGenerator;
    readonly suffixText?: string | SuffixTextGenerator;
};

type PromiseOptions<T> = {
    successText?: string | ((result: T) => string) | undefined;
    failText?: string | ((error: Error) => string) | undefined;
} & Options;

const ASCII_ETX_CODE = 0x03; // Ctrl+C emits this code

/**
 * Handles discarding stdin input to prevent interference with the spinner.
 */
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
        if (chunk[0] === ASCII_ETX_CODE) {
            process.emit("SIGINT");
        }
    }
}

/**
 * The main Ora class for creating and managing spinners.
 */
class Ora {
    #linesToClear = 0;
    #isDiscardingStdin = false;
    #lineCount = 0;
    #frameIndex = -1;
    #lastSpinnerFrameTime = 0;
    #options: Options;
    #spinner: Spinner;
    #stream: NodeJS.WriteStream;
    #id: NodeJS.Timeout | undefined;
    #initialInterval: number | undefined;
    #isEnabled: boolean;
    #isSilent: boolean;
    #indent: number;
    #text: string;
    #prefixText: string | PrefixTextGenerator;
    #suffixText: string | SuffixTextGenerator;
    #stdinDiscarder = new StdinDiscarder();
    color: Color;
    lastIndent: number;

    // For test environment
    _stream: NodeJS.WriteStream;
    _isEnabled: boolean;

    constructor(options: string | Options) {
        if (typeof options === "string") {
            options = { text: options };
        }

        this.#options = {
            color: "cyan",
            stream: process.stderr as NodeJS.WriteStream,
            discardStdin: true,
            hideCursor: true,
            ...options,
        };

        this.color = this.#options.color;
        this.spinner = this.#options.spinner;
        this.#initialInterval = this.#options.interval;
        this.#stream = this.#options.stream as NodeJS.WriteStream;
        this.#isEnabled = typeof this.#options.isEnabled === "boolean" ? this.#options.isEnabled : isInteractive({ stream: this.#stream });
        this.#isSilent = typeof this.#options.isSilent === "boolean" ? this.#options.isSilent : false;

        this.text = this.#options.text ?? "";
        this.prefixText = this.#options.prefixText ?? "";
        this.suffixText = this.#options.suffixText ?? "";
        this.indent = this.#options.indent ?? 0;
        this.lastIndent = this.#indent;

        // For test environment
        this._stream = this.#stream;
        this._isEnabled = this.#isEnabled;

        if (process.env.NODE_ENV === "test") {
            Object.defineProperty(this, "_linesToClear", {
                get() {
                    return this.#linesToClear;
                },
                set(newValue) {
                    this.#linesToClear = newValue;
                },
            });

            Object.defineProperty(this, "_frameIndex", {
                get() {
                    return this.#frameIndex;
                },
            });

            Object.defineProperty(this, "_lineCount", {
                get() {
                    return this.#lineCount;
                },
            });
        }
    }

    /**
     * Checks if Unicode is supported in the current environment.
     */
    isUnicodeSupported(): boolean {
        if (process.platform !== "win32") {
            return process.env.TERM !== "linux";
        }

        return Boolean(process.env.CI) || Boolean(process.env.WT_SESSION) || Boolean(process.env.TERMINUS_SUBLIME) || process.env.ConEmuTask === "{cmd::Cmder}" || process.env.TERM_PROGRAM === "Terminus-Sublime" || process.env.TERM_PROGRAM === "vscode" || process.env.TERM === "xterm-256color" || process.env.TERM === "alacritty" || process.env.TERMINAL_EMULATOR === "JetBrains-JediTerm";
    }

    get indent(): number {
        return this.#indent;
    }

    set indent(indent: number) {
        if (!(indent >= 0 && Number.isInteger(indent))) {
            throw new Error("The `indent` option must be an integer from 0 and up");
        }

        this.#indent = indent;
        this.#updateLineCount();
    }

    get interval(): number {
        return this.#initialInterval ?? this.#spinner.interval ?? 100;
    }

    get spinner(): Spinner {
        return this.#spinner;
    }

    set spinner(spinner: SpinnerName | Spinner) {
        this.#frameIndex = -1;
        this.#initialInterval = undefined;

        if (typeof spinner === "object") {
            if (spinner.frames === undefined) {
                throw new Error("The given spinner must have a `frames` property");
            }

            this.#spinner = spinner;
        } else if (!this.isUnicodeSupported()) {
            this.#spinner = cliSpinners.line;
        } else if (spinner === undefined) {
            this.#spinner = cliSpinners.dots;
        } else if (cliSpinners[spinner as SpinnerName]) {
            this.#spinner = cliSpinners[spinner as SpinnerName];
        } else {
            throw new Error(`There is no built-in spinner named '${spinner}'. See https://github.com/sindresorhus/cli-spinners/blob/main/spinners.json for a full list.`);
        }
    }

    get text(): string {
        return this.#text;
    }

    set text(value: string) {
        this.#text = value;
        this.#updateLineCount();
    }

    get prefixText(): string | PrefixTextGenerator {
        return this.#prefixText;
    }

    set prefixText(value: string | PrefixTextGenerator) {
        this.#prefixText = value;
        this.#updateLineCount();
    }

    get suffixText(): string | SuffixTextGenerator {
        return this.#suffixText;
    }

    set suffixText(value: string | SuffixTextGenerator) {
        this.#suffixText = value;
        this.#updateLineCount();
    }

    get isSpinning(): boolean {
        return this.#id !== undefined;
    }

    #getFullPrefixText(prefixText: string | PrefixTextGenerator = this.#prefixText, postfix: string = " "): string {
        if (typeof prefixText === "string" && prefixText !== "") {
            return prefixText + postfix;
        }

        if (typeof prefixText === "function") {
            return prefixText() + postfix;
        }

        return "";
    }

    #getFullSuffixText(suffixText: string | SuffixTextGenerator = this.#suffixText, prefix: string = " "): string {
        if (typeof suffixText === "string" && suffixText !== "") {
            return prefix + suffixText;
        }

        if (typeof suffixText === "function") {
            return prefix + suffixText();
        }

        return "";
    }

    #updateLineCount(): void {
        const columns = this.#stream.columns ?? 80;
        const fullPrefixText = this.#getFullPrefixText(this.#prefixText, "-");
        const fullSuffixText = this.#getFullSuffixText(this.#suffixText, "-");
        const fullText = " ".repeat(this.#indent) + fullPrefixText + "--" + this.#text + "--" + fullSuffixText;

        this.#lineCount = 0;
        for (const line of stripAnsi(fullText).split("\n")) {
            this.#lineCount += Math.max(1, Math.ceil(stringWidth(line) / columns));
        }
    }

    get isEnabled(): boolean {
        return this.#isEnabled && !this.#isSilent;
    }

    set isEnabled(value: boolean) {
        if (typeof value !== "boolean") {
            throw new TypeError("The `isEnabled` option must be a boolean");
        }

        this.#isEnabled = value;
    }

    get isSilent(): boolean {
        return this.#isSilent;
    }

    set isSilent(value: boolean) {
        if (typeof value !== "boolean") {
            throw new TypeError("The `isSilent` option must be a boolean");
        }

        this.#isSilent = value;
    }

    frame(): string {
        const now = Date.now();
        if (this.#frameIndex === -1 || now - this.#lastSpinnerFrameTime >= this.interval) {
            this.#frameIndex = ++this.#frameIndex % this.#spinner.frames.length;
            this.#lastSpinnerFrameTime = now;
        }

        const { frames } = this.#spinner;
        let frame = frames[this.#frameIndex];

        if (this.color) {
            frame = colors[this.color](frame);
        }

        const fullPrefixText = typeof this.#prefixText === "string" && this.#prefixText !== "" ? this.#prefixText + " " : "";
        const fullText = typeof this.text === "string" ? " " + this.text : "";
        const fullSuffixText = typeof this.#suffixText === "string" && this.#suffixText !== "" ? " " + this.#suffixText : "";

        return fullPrefixText + frame + fullText + fullSuffixText;
    }

    clear(): this {
        if (!this.#isEnabled || !this.#stream.isTTY) {
            return this;
        }

        this.#stream.cursorTo(0);

        for (let index = 0; index < this.#linesToClear; index++) {
            if (index > 0) {
                this.#stream.moveCursor(0, -1);
            }

            this.#stream.clearLine(1);
        }

        if (this.#indent || this.lastIndent !== this.#indent) {
            this.#stream.cursorTo(this.#indent);
        }

        this.lastIndent = this.#indent;
        this.#linesToClear = 0;

        return this;
    }

    render(): this {
        if (this.#isSilent) {
            return this;
        }

        this.clear();
        this.#stream.write(this.frame());
        this.#linesToClear = this.#lineCount;

        return this;
    }

    start(text?: string): this {
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
            this.#stdinDiscarder.start();
        }

        this.render();
        this.#id = setInterval(this.render.bind(this), this.interval);

        return this;
    }

    stop(): this {
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
            this.#stdinDiscarder.stop();
            this.#isDiscardingStdin = false;
        }

        return this;
    }

    succeed(text?: string): this {
        return this.stopAndPersist({ symbol: logSymbols.success, text });
    }

    fail(text?: string): this {
        return this.stopAndPersist({ symbol: logSymbols.error, text });
    }

    warn(text?: string): this {
        return this.stopAndPersist({ symbol: logSymbols.warning, text });
    }

    info(text?: string): this {
        return this.stopAndPersist({ symbol: logSymbols.info, text });
    }

    stopAndPersist(options: PersistOptions = {}): this {
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

/**
 * Creates a new Ora instance.
 */
export default function ora(options?: string | Options): Ora {
    return new Ora(options);
}

/**
 * Handles a promise with a spinner.
 */
export async function oraPromise<T>(action: PromiseLike<T> | ((spinner: Ora) => PromiseLike<T>), options?: string | PromiseOptions<T>): Promise<T> {
    const actionIsFunction = typeof action === "function";
    const actionIsPromise = "then" in action && typeof action.then === "function";

    if (!actionIsFunction && !actionIsPromise) {
        throw new TypeError("Parameter `action` must be a Function or a Promise");
    }

    const { successText, failText } = typeof options === "object" ? options : { successText: undefined, failText: undefined };

    const spinner = ora(options).start();

    try {
        const promise = actionIsFunction ? action(spinner) : action;
        const result = await promise;

        spinner.succeed(successText === undefined ? undefined : typeof successText === "string" ? successText : successText(result));

        return result;
    } catch (error) {
        spinner.fail(failText === undefined ? undefined : typeof failText === "string" ? failText : failText(error));

        throw error;
    }
}

export { default as spinners } from "cli-spinners";
