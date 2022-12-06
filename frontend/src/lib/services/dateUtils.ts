
function isValidDateObj(d:Date): boolean {
    return d instanceof Date && !isNaN(d as any);
}

export function newDateOrNull(dateStr: string | null): Date | null{
    if(!dateStr){
        return null;
    }

    const result = new Date(dateStr);

    if(!isValidDateObj(result)){
        return null;
    }

    return result;
}