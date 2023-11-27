<script lang="ts">
    import Quill from 'quill';

    export let text = "";
    export let placeholder = "enter text";

    const formats = [
        'bold', 
        'italic', 
        'underline', 
        'color', 
        'link',
        'background',
        'strike',
    ];

    const toolbarConfig = [
        ['bold', 'italic', 'underline', 'strike', 'link', ],
    ];

    function quillAction(node: HTMLElement, { placeholder }: { placeholder:string }){
        const editor = new Quill(node, {
            modules: { 
                toolbar: toolbarConfig
            },
            theme: 'bubble',
            placeholder: placeholder,
            formats: formats,
        });

        if(text){
            // text comes in as raw html 
            // https://stackoverflow.com/questions/46626633/how-do-you-insert-html-into-a-quilljs
            const delta = editor.clipboard.convert(text)
            editor.setContents(delta, 'silent');
        }

        editor.focus();

        editor.on('text-change', (delta:any, oldDelta:any, source:any) => {
            // if (source == 'api') {
            //     console.log("An API call triggered this change.");
            // } else if (source == 'user') {
            //     console.log("A user action triggered this change.");
            // }

            if(source === 'user'){
                // const payload = { detail: { text: editor.getText() }};
                const payload = { detail: { text: editor.root.innerHTML }};
                node.dispatchEvent(new CustomEvent("textchange", payload));
            }
        });
        return {
            destroy: () => {
                console.log("quill editor removed"); 
            }
        }
    }
</script>


<div use:quillAction={{placeholder}} class="editor" on:textchange></div>



<style>
    @import 'https://cdn.quilljs.com/1.3.6/quill.bubble.css';

    .editor{
        border: 1px solid #000;
        width: 100%;
        height: 100%;
    }

    :global(.ql-container){
        font-size: var(--font-size);
    }
</style>