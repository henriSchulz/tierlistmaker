import Breakpoint from "@/types/Breakpoint";

export function getTextFieldValue(id: string): string | undefined {
    const element = document.getElementById(id) as HTMLInputElement;
    if (!element) return undefined;

    return element.value;
}

export function wait(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
}

export function getWindowWidth(): Breakpoint {
    if (window.innerWidth < 600) {
        return "xs"
    }

    if (window.innerWidth < 900) {
        return "sm"
    }

    if (window.innerWidth < 1200) {
        return "md"
    }

    if (window.innerWidth < 1539) {
        return "lg"
    }

    return "xl"
}

export function isXsWindow() {
    return getWindowWidth() === "xs"
}

export async function setClipboard(text: string): Promise<void> {
    const type = "text/plain";
    const blob = new Blob([text], {type});
    const data = [new ClipboardItem({[type]: blob})];
    await navigator.clipboard.write(data);
}

export function isDarkMode(): boolean {
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
}

export async function urlToFile(imgSrc: string, filename: string): Promise<File> {
    const response = await fetch(imgSrc);
    const blob = await response.blob();
    const fullFilename = filename + "." + blob.type.split("/")[1];
    return new File([blob], fullFilename, {type: blob.type});
}
