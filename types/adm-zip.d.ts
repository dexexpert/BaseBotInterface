declare module "adm-zip" {
  export default class AdmZip {
    constructor(bufferOrPath?: string | Buffer);

    extractAllTo(destinationPath: string, overwrite?: boolean): void;
    getEntries(): ZipEntry[];
    addLocalFile(filePath: string, zipPath?: string): void;
    addFile(entryName: string, content: Buffer | string): void;
    toBuffer(): Buffer;
    writeZip(targetFilePath?: string): void;
  }

  export class ZipEntry {
    entryName: string;
    getData(): Buffer;
    getName(): string;
  }
}
