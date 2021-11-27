import multe from 'multer';
import mkdir from 'mkdirp';


const GetDirectory = () => {
    let year = new Date().getFullYear();
    let month = new Date().getMonth();
    let day = new Date().getDay();
    return `src/public/uploads/getway/${year}/${month}/${day}`;
};

const coinStorage = multe.diskStorage({
    destination: (req: any, file: any, cb: any) => {
        let dir = GetDirectory();
        mkdir(dir).then((made: any) => {
            cb(null, dir);
        });
    },
    filename: (req: any, file: any, cb: any) => {
        let fileName = GetDirectory() + "/" + file.originalname;
        cb(null, file.originalname);
    },
});

const fileFilter = (req: any, file: any, cb: any) => {
    if (file.mimetype == 'image/jpeg' || file.mimetype == 'image/png') {
        cb(null, true);
    } else {
        cb(null, false);
    }
}

const UploadGetwayIcon = multe({
    storage: coinStorage,
    fileFilter: fileFilter
});

export default UploadGetwayIcon;