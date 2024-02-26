
import tippy from 'tippy.js';
import 'tippy.js/dist/tippy.css'; // optional for styling
import 'tippy.js/themes/light.css';


export interface TippyParams{
    content?:string,
}

export default function tippyAction(node: HTMLElement, params:TippyParams = {} ){

    tippy(node, {
        content: params.content ?? 'missing tooltip',
        touch: ['hold', 500],
        duration: 500,
        delay: [500, 200],
        theme:"light",
    });
}