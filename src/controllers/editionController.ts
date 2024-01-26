import { Request, Response } from "express";

import upload from "../config/multer"
import { extractPages, getDateFromFilename, getEditionTypeFromFilename, getFilenameFromPath, sanitizePage } from "../server";
import {client} from "../infra/elastic";
import { EditionService } from "../services/editionService";


export async function indexEdition(request: Request, response: Response){
    EditionService.handler(request.file.path)
}