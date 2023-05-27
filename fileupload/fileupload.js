const element = document.querySelector('#myFile');
const pEl = document.querySelector('.analysisFile');


element.addEventListener('input', (event) => {
    // ファイルのロード
    const target = event.target;
    const files = target.files;
    const file = files[0];

    const reader = new FileReader();

    reader.addEventListener('load', () => {
        console.log(reader.result);
        res = reader.result
    });
    reader.readAsText(file);
});