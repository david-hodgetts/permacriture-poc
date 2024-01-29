import type { id } from "./Id";

export const authorColors = [
    "#707070", "#C95454", "#6C7B5B", "#585858",
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