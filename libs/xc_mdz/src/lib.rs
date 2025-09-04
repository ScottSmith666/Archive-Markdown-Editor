#![deny(clippy::all)]
#![allow(unused_variables)]
#![allow(dead_code)]
#[warn(unused_assignments)]

use napi_derive::napi;

use std::fs;
use std::io::copy;
use std::io::Write;
use std::string::String;
use zip::unstable::write::FileOptionsExt;

use zip::result::ZipError;

use anyhow::Context;
use std::io::prelude::*;
use zip::write::{FileOptions, SimpleFileOptions};

use std::fs::File;
use std::fs::rename;
use std::process::Command;
use std::path::{Path, PathBuf};
use walkdir::{DirEntry, WalkDir};

fn remove_ds_store_etc(folder: &str) {
    // 删除目录内所有的.DS_Store和__MACOSX
    Command::new("sh").arg("-c").arg(format!("find {} -name \".DS_Store\" -print0 | xargs -0 rm", folder));
    Command::new("sh").arg("-c").arg(format!("find {} -name \"_MACOSX\" -print0 | xargs -0 rm", folder));
}

fn zip_dir<T>(
    it: &mut dyn Iterator<Item = DirEntry>,
    prefix: &Path,
    writer: T,
    method: zip::CompressionMethod,
    password: Vec<u8>,
    use_password: i32,
) -> anyhow::Result<()>
where
    T: Write + Seek,
{
    if !cfg!(target_os = "windows") {
        remove_ds_store_etc(prefix.to_str().unwrap());
    }
    let mut zip = zip::ZipWriter::new(writer);
    let mut options: FileOptions<()> = Default::default();
    if use_password == 1 {
        println!("已使用密码...");
        options = SimpleFileOptions::default().compression_method(method).unix_permissions(0o755).with_deprecated_encryption(&password);
    } else {
        options = SimpleFileOptions::default().compression_method(method).unix_permissions(0o755);
    }
    let prefix = Path::new(prefix);
    let mut buffer = Vec::new();
    for entry in it {
        let path = entry.path();
        let name = path.strip_prefix(prefix).unwrap();
        let path_as_string = name
            .to_str()
            .map(str::to_owned)
            .with_context(|| format!("{name:?} Is a Non UTF-8 Path"))?;

        // Write file or directory explicitly
        // Some unzip tools unzip files with directory paths correctly, some do not!
        if path.is_file() {
            println!("adding file {path:?} as {name:?} ...");
            zip.start_file(path_as_string, options)?;
            let mut f = File::open(path)?;

            f.read_to_end(&mut buffer)?;
            zip.write_all(&buffer)?;
            buffer.clear();
        } else if !name.as_os_str().is_empty() {
            // Only if not root! Avoids path spec / warning
            // and mapname conversion failed error on unzip
            println!("adding dir {path_as_string:?} as {name:?} ...");
            zip.add_directory(path_as_string, options)?;
        }
    }
    zip.finish()?;
    Ok(())
}

fn c_zip(src_dir: &Path, dst_file: &Path, method: zip::CompressionMethod, password: String, use_password: i32) -> i32 {
    // 压缩zip
    let path = Path::new(dst_file);
    let file = File::create(path).unwrap();
    let walkdir = WalkDir::new(src_dir);
    let it = walkdir.into_iter();
    let password_bytes: Vec<u8> = password.bytes().collect();
    let _ = zip_dir(
        &mut it.filter_map(|e| e.ok()),
        src_dir,
        file,
        method,
        password_bytes,
        use_password
    );
    0
}

fn x_zip(src_file: &Path, dst_dir: &Path, method: zip::CompressionMethod, password: String, use_password: i32) -> Result<(), ZipError> {
    // 解压zip
    let file = File::open(src_file).unwrap();
    let mut archive = zip::ZipArchive::new(file).unwrap();
    for i in 0..archive.len() {
        let mut file = if use_password == 1 {
            archive.by_index_decrypt(i, password.as_bytes())?
        } else {
            archive.by_index(i)?
        };

        let outpath = match file.enclosed_name() {
            Some(path) => dst_dir.join(path),
            None => continue,
        };

        {
            let comment = file.comment();
            if !comment.is_empty() {
                println!("File {i} comment: {comment}");
            }
        }
        if file.is_dir() {
            println!("File {} extracted to \"{}\"", i, outpath.display());
            fs::create_dir_all(&outpath).unwrap();
        } else {
            println!(
                "File {} extracted to \"{}\" ({} bytes)",
                i,
                outpath.display(),
                file.size()
            );
            if let Some(p) = outpath.parent() {
                if !p.exists() {
                    fs::create_dir_all(p).unwrap();
                }
            }
            let mut outfile = File::create(&outpath).unwrap();
            copy(&mut file, &mut outfile).unwrap();
        }

        // Get and Set permissions
        #[cfg(unix)]
        {
            use std::os::unix::fs::PermissionsExt;
            if let Some(mode) = file.unix_mode() {
                fs::set_permissions(&outpath, fs::Permissions::from_mode(mode)).unwrap();
            }
        }
    }

    // 在Windows下，将文件夹设置为隐藏
    if cfg!(target_os = "windows") {
        // 创建Windows隐藏文件夹
        Command::new("attrib")
            .args(&["+h", dst_dir.to_str().unwrap()])
            .status()
            .expect("Failed to set hidden attribute");
    }
    Ok(())
}

#[napi]
pub fn xc_mdz(
    source_path: String,
    out_path: String,
    compress_or_extract: i32, // 压缩还是解压，1为压缩，2为解压
    use_password: i32,        // 是否使用密码，1为使用，2为不使用
    zip_password: String,     // 密码，如果不使用，Node那边会传来空字符串
) -> i32 {
    let source_path_rs = source_path;
    let out_path_rs = out_path;
    let zip_password_rs = zip_password;
    let compress_or_extract_rs = compress_or_extract;
    let use_password_rs = use_password;
    println!("compress_or_extract = {:?}", compress_or_extract_rs);
    let src_dir = PathBuf::from(source_path_rs);
    let dst_file = PathBuf::from(out_path_rs);
    let method = zip::CompressionMethod::Deflated;  // 压缩算法

    if compress_or_extract_rs == 1 {
        // 压缩
        let status = c_zip(
            &src_dir,
            &dst_file,
            method,
            zip_password_rs.parse().unwrap(),
            use_password_rs
        );
        println!("{:?}", status);
    } else if compress_or_extract_rs == 2 {
        // 解压
        let status = x_zip(
            &src_dir,
            &dst_file,
            method,
            zip_password_rs.parse().unwrap(),
            use_password_rs
        );
        let x_status = match status {
            Ok(code) => 0,
            Err(err) => -1
        };
        return x_status;
    }
    0
}
