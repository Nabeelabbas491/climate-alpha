import { AppConstants } from "./constants";
import * as FileSaver from "file-saver";

export class FileConstant {

    public static fileTypeOptions = {
        text: {
            'blob_type': 'text/csv',
            'ext': 'csv'
        },
        arraybuffer: {
            'blob_type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;',
            'ext': 'xlsx'
        },
        blob: {
            'blob_type': 'application/zip',
            'ext': 'zip'
        }
    }

    public static saveFile({ response, fileType, fileName = `AlphaGeo-${AppConstants.getRandomInt(0, 1000)}` }) {
        let blob = new Blob([response], { type: FileConstant.fileTypeOptions[fileType].blob_type });
        if (response.responseType == fileType || response.responseType == 'blob') fileName = `results`;
        FileSaver.saveAs(blob, `${fileName}.${FileConstant.fileTypeOptions[fileType].ext}`)
    }

}