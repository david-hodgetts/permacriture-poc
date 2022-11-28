
/**
 * truncates string to max len == desiredCharCount, 
 * also adds an ellipsis char at end of string
 * @param text: string
 * @param desiredCharCount :string
 * @returns truncated string
 */
export function truncate(text:string, desiredCharCount:number): string{
    if(text.length <= desiredCharCount){
        return text;
    }
    const subString = text.slice(0, desiredCharCount - 1);
    return subString.slice(0, subString.lastIndexOf(" ")) + "\u2026";
}