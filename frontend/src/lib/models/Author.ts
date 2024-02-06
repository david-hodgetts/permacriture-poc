import type { id } from "./Id";

export const authorColors = [
    "#1127A8",
    "#1A3C59",
    "#0297B0",
    "#46C6BD",
    "#74D1A9",
    "#125E62",
    "#537A39",
    "#4B9174",
    "#1AB597",
    "#77CE67",
    "#A85432",
    "#684426",
    "#976627",
    "#D2932A",
    "#AFB226",
    "#D36A9A",
    "#BF2161",
    "#8F6386",
    "#5B456A",
    "#562E3E",
    "#740E23",
    "#B5525D",
    "#BA1E1E",
    "#F05B5B",
    "#F05C22",
    "#F58D58",
];


export function colorForAuthor(author: Author){

    let colorIndex = 0;

    if (author && author.nickname.length > 0) {
        colorIndex = author!.nickname.charCodeAt(0) % authorColors.length;
    }

    return authorColors[colorIndex];
}

export default interface Author
{
    id: id;
    nickname: string;
}