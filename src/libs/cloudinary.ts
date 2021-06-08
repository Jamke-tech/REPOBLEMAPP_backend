const cloudinary = require('cloudinary').v2;

//Configuració de cloudinary
cloudinary.config({
    cloud_name:'repoblemapp',
    api_key: '168943783851354',
    api_secret: 'uNelnOOPzkuhsrsU2gvgi_ls_es'
})

export default cloudinary 