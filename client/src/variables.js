function makeCode(length) {
    var code = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for(let i=0; i<length; i++){
        code += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return code;
}

const code = makeCode(17);
export { code };
