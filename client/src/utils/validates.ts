export function validatePositiveRealNumber(inputStr: string): boolean {
    const pattern = /^(?!0$)(?!0\.0+$)([1-9]\d*|0?\.\d*[1-9]\d*|[1-9]\d*\.\d+)$/;
    return pattern.test(inputStr);
}