const uploadFile = async () => {
    var formData = new FormData();
    var file = document.getElementById('file').files[0];
    formData.append('file', file);
    var response = await fetch('/ideas/api/file/upload', {
        method: 'POST',
        body: formData
    });
    if (!response.ok) {
        alert('Failed to upload file!');
        return;
    }
    var data = await response.json();
    return data;
}