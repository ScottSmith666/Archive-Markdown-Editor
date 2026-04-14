declare const mdzUtils: {
    genOrDecompressMdz(
        inputPath: String,
        destPath: String,
        instruction: String,
        compressPassword: String,
        decompressPassword: String
    ): Promise;
};

export = mdzUtils;
