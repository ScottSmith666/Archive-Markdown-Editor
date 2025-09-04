#![deny(clippy::all)]

use std::path::PathBuf;
use napi_derive::napi;
use std::process::Command;


#[napi]
pub fn inv_dir_creator(path: String) -> () {
    // 创建文件夹
    let path_buf = PathBuf::from(&path);
    std::fs::create_dir_all(&path_buf).unwrap();

    if cfg!(target_os = "windows") {
        // 创建Windows隐藏文件夹
        Command::new("attrib")
            .args(&["+h", &*path])
            .status()
            .expect("Failed to set hidden attribute");
    } else {
        Command::new("mkdir")
            .args(&[&*path])
            .status()
            .expect("Failed to set hidden attribute");
    }
}
