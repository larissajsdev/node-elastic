const extract = require("pdf-text-extract")
import { client } from "../src/infra/elastic"
import express from "express"
var walk = require('walkdir');
import multer from "multer";
import fs from 'fs'
import editionRoute from "./routes/editionRoute"
const app = express();
import path from "path"
import { normalQuery, phraseQuery } from "./config/queryBuilder";

app.listen(3001, () => { console.log("app listen on port 3000") })
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(editionRoute)

const storage = multer.diskStorage({
  destination: function (req, file, cb) {

    const type = getEditionTypeFromFilename(file.originalname)
    console.log(file.originalname)
    const { year, month } = getDateFromFilename2(file.originalname)
    const path = `${type}/${year}/${month}`
    fs.mkdirSync(__dirname + "/" + path, { recursive: true })
    return cb(null, __dirname + "/" + path)
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname)
  }
})


app.get("/search", async (req, res) => {
  const { termo, dataInicial, dataFinal, tipoEdicao, pagina, size, quantidade } = req.query;

  if (termo.split(" ").length > 1) {
    const response = await client.search(phraseQuery(termo))
    res.status(200).json(response)
  } else {
    const response = await client.search(normalQuery(termo))
    res.status(200).json(response)
  }
})


const indice = 'e-index-pdf3';

walk(path.join(__dirname, "..", "edicoes", "Executivo", "2001", "01"), async function (path: string, stat: any) {


  if (path.includes(".pdf") && path.includes !== undefined) {
    const filename = getFilenameFromPath(path)
    const editionType = getEditionTypeFromFilename(filename)
    const editionDate = getDateFromFilename(filename)
    console.log(filename)

    const pages: any = await extractPages(path)

    pages.forEach(async (page: string, index: number) => {
      await client.index({
        index: indice,
        body: { content: sanitizePage(page), edition: editionType, page: index, date: editionDate },
      })
    })
  } else {
    return;
  }
});

export const extractPages = (path: string | undefined) => {
  return new Promise((resolve, reject) => {
    extract(path, { splitPages: true }, (err: string, pages: string) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(pages || []);
    });
  });
};





export function sanitizePage(pageContent: string) {
  return pageContent.replace(/[-\n$]|(^ +| +$|( )+)/g, " ")
}

export function getFilenameFromPath(path: string | undefined) {

  const paths = path?.split("/")
  const filename = paths[paths?.length - 1];

  return filename
}

export function getAcronymFromFilename(filename: string | undefined) {
  return filename?.substring(0, 2)
}
export function buildPathFromFilename(filename: string | undefined) {
  return __dirname + `/edicoes/${getEditionTypeFromFilename(filename)}/`
}

export function getEditionTypeFromFilename(filename: string | undefined) {
  if (filename === undefined) return;
  const siglaEdicao = filename.substring(0, 2);
  switch (siglaEdicao) {
    case "EX":
      return "Executivo";
    case "TE":
      return "Terceiros";
    case "JU":
      return "Judiciário";
    case "SX":
      return "Suplemento Executivo";
    case "ST":
      return "Suplemento Terceiros";
    case "SJ":
      return "Suplemento Judiciário";
    case "DE":
      return "Extraordinário Executivo";
    case "EE":
      return "Extraordinário Terceiros";
    case "ET":
      return "Extra Terceiros";
    case "EC":
      return "Extra Executivo";
    default:
      null
  }
}
export function getDateFromFilename(filename: string | undefined) {

  //TE20201212.pdf
  const year = filename?.substring(2, 6)
  const month = filename?.substring(6, 8)
  const day = filename?.substring(8, 10)

  return `${year}-${month}-${day}`

}
export function getDateFromFilename2(filename: string | undefined) {

  //TE20201212.pdf
  const year = filename?.substring(2, 6)
  const month = filename?.substring(6, 8)
  const day = filename?.substring(8, 10)

  return {
    year,
    month,
    day
  }

}


