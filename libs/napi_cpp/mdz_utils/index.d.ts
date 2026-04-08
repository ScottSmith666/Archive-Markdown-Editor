declare const mdzUtils: {
    genOrDecompressMdz(
        callback: Function,
        inputPath: String,
        instruction: String,
        destPath: String,
        compressPassword: String,
        decompressPassword: String
    ): Object;
    verifyMdzIsEncrypted(inputPath: String): boolean;
};

export = mdzUtils;
