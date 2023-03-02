var initEditor = () => {

    const toolbar = [
        [{ 'size': [] }],
        ['bold', 'italic', 'underline', 'strike'],
        [{ 'color': [] }, { 'background': [] }],
        [{ 'script': 'super' }, { 'script': 'sub' }],
        [{ 'header': '1' }, { 'header': '2' }, 'blockquote', 'code-block'],
        [{ 'list': 'ordered' }, { 'list': 'bullet' }, { 'indent': '-1' }, { 'indent': '+1' }],
        ['direction', { 'align': [] }],
        ['link', 'image', 'video', 'formula'],
        ['clean']
    ]

    var editor = new Quill('#editorjs', {
        modules: {
            toolbar : toolbar
        },
        placeholder: 'Compose an epic...',
        readOnly: false,
        theme: 'snow'
    });
}