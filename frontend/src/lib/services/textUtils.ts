
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

export function produceDateString(date: Date|null) {
    if(date === null){
        return "";
    }
    return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
}

export function produceTimeString(date: Date|null) {
    if(date === null){
        return "";
    }
    return `${String(date.getHours()).padStart(2, '0')}h${String(date.getMinutes()).padStart(2, '0')}`;
}

/**
 * Returns a hash code from a string
 * @param  {String} str The string to hash.
 * @return {Number}    A 32bit integer
 * @see http://werxltd.com/wp/2010/05/13/javascript-implementation-of-javas-string-hashcode-method/
 */
export function hashStr(str:string): number {
    let hash = 0;
    for (let i = 0, len = str.length; i < len; i++) {
        let chr = str.charCodeAt(i);
        hash = (hash << 5) - hash + chr;
        hash |= 0; // Convert to 32bit integer
    }
    return hash;
}

/**
 * produces a color given a string 
 * @param any text 
 * @returns a color 
 */
export function stringToColor(input: string): string{
        if(!input){
            return "#00ff00";
        }

        const toHex = (num: number) => num.toString(16).padStart(2, '0');

        const hash = hashStr(input);
        const inDomain = hash % Math.pow(2, 24);
        const red = inDomain & 0xff;
        const green = (inDomain >> 8) & 0xff;
        const blue = (inDomain >> 16) & 0xff;
        return `#${toHex(red)}${toHex(green)}${toHex(blue)}`;
}
