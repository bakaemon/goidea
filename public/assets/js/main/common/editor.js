window.addEventListener('load', () => {
    tinymce.init({
        selector:'textarea',
        menubar: false,
    });
    tinymce.init({
        selector: 'textarea#idea',
        image_title: true,
        automatic_uploads: true,
        file_picker_callback:uploadCallback
    })
})

const uploadCallback = (callback, value, meta) => {
    alert(meta.filetype)

}

        
