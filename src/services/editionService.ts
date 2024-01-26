import { client } from "../infra/elastic"
import { extractPages, getDateFromFilename, getEditionTypeFromFilename, getFilenameFromPath, sanitizePage } from "../server"



export class EditionService {
    static async handler(path: string ) {
        const pages: any = await extractPages(path)


        const filename = getFilenameFromPath(path)
        const type = getEditionTypeFromFilename(filename)
        const editionDate = getDateFromFilename(filename)

        pages.forEach(async (page: string, index: number) => {
            const response = await client.index({
                index: "pdf-index",
                body: { content: sanitizePage(page), edition: type, page: index, date: editionDate },
            })
            console.log(response)
        })
    }
}

// function indexEditionsPages(pages: Page[]){
//     pages.forEach()
// }
// export interface Edition{
//     type: string,
//     date: string,
//     Pages: Page[]
// }
// export interface Page{
//     content: string,
//     number: number
// }