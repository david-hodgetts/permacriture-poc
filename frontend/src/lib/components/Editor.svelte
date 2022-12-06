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

    function quillAction(node: HTMLElement, { placeholder }: { placeholder:string }){
        const editor = new Quill(node, {
            modules: {  },
            theme: 'bubble',
            placeholder: placeholder,
            formats: formats,
        });

        if(text){
            editor.setText(text, 'api');
        }

        editor.focus();

        editor.on('text-change', (delta, oldDelta, source) => {
            if (source == 'api') {
                console.log("An API call triggered this change.");
            } else if (source == 'user') {
                console.log("A user action triggered this change.");
            }

            if(source === 'user'){
                const payload = { detail: { text: editor.getText() }};
                node.dispatchEvent(new CustomEvent("text-change", payload));
            }
        });
        return {
            destroy: () => {
                console.log("quill editor removed"); 
            }
        }
    }
</script>


<div use:quillAction={{placeholder}} class="editor">

</div>



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