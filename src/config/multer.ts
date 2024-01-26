import multer from "multer";
import { getDateFromFilename2, getEditionTypeFromFilename } from "../server";
import fs from "fs"
import path from "path"

const storage= multer.diskStorage({
    destination: function (req, file, cb){
        const type = getEditionTypeFromFilename(file.originalname)
        const {year, month} = getDateFromFilename2(file.originalname)
        const editionsPath = `${type}/${year}/${month}`
        const editionFullPath = path.join(__dirname, "..", "..", "edicoes", editionsPath)
        fs.mkdirSync(editionFullPath, { recursive: true })
        return cb(null,editionFullPath)
    },
    filename: function (req, file, cb){
        cb(null, file.originalname)
    }
})
export default multer({storage})

