//
// Created by Scott Smith on 2026/3/28.
//

#include <iostream>

#include <bit7z/bitfileextractor.hpp>

int main(int argc, char* argv[])
{
    try
    {
        // bit7z classes can throw BitException objects
        using namespace bit7z;

        Bit7zLibrary lib{"/Volumes/Execute/Files/project/ame_new/archive_markdown_editor/libs/napi_cpp/7zip_process/third_party/bit7z/lib/arm64/7z.so"};
        BitFileExtractor extractor{lib, BitFormat::SevenZip};

        // Extracting a simple archive
        extractor.extract("/Users/scottsmith/Desktop/bit7z-v4.0.11-clang13.0.1_x64.7z", "/Users/scottsmith/Desktop/hahaha");

        // Extracting an encrypted archive
        // extractor.setPassword("password");
        // extractor.extract("path/to/another/archive.7z", "out/dir/");
    }
    catch (const bit7z::BitException& ex)
    {
        /* Do something with ex.what()...*/
        std::cout << "Error: " << ex.what() << std::endl;
    }
    return 0;
}
