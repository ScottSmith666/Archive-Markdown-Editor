# Third-Party Library: VLC
## Function Introduction
VLC Media Player is a completely free, open-source, cross-platform multimedia player renowned for its powerful compatibility. Its most significant feature is the ability to play the vast majority of audio and video formats available on the market (such as MP4, AVI, MKV, MP3, etc.), as well as DVDs and streaming network protocols, without needing to install any additional codecs or plugins. Developed by a global team of volunteers, the software supports almost all mainstream operating systems including Windows, macOS, Linux, Android, and iOS. Beyond its core playback functionality, it also provides advanced tools such as video transcoding, screen recording, audio and video effect adjustment, and subtitle synchronization.

## Third-Party Library Version
- v3.0.21

## Supported Features
- RTMP stream playback is supported: (Basic library functionalities include playback state control (start, pause, stop), volume adjustment, background logging, and adaptation for API level 17 and above)
- Supports playback of MP4 video files
- Supports playback of video files with subtitles
- RTSP stream playback is supported

## Usage Constraints
- [IDE and SDK Version](../../docs/constraint.md)

## Integration Methods
+ [Application HAP Package Integration](docs/hap_ingtegrate_en.md)

## Description of outstanding issues
During the development of the VLC third-party library, an exception occurs when the OH_AudioStreamBuilder_GenerateRenderer interface is called in version 16 or earlier. As a result, no sound is output when video files are played. The VLC library only supports API 17 and later versions.
