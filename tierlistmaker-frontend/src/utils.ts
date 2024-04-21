export function getTextFieldValue(id: string): string | undefined {
    const element = document.getElementById(id) as HTMLInputElement;
    if (!element) return undefined;

    return element.value;
}

export function wait(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
}