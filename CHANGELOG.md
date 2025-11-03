# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2024-11-02

### Added
- Initial release of koishi-plugin-lsnet
- Support for artist style recognition using ComfyUI LSNet API
- Integration with Kaloscope 2.0 model
- OneBot protocol support
- Configurable API endpoint and model parameters
- Multiple image fetching strategies (URL, bot API, file path)
- Base64 image encoding support
- Confidence score display
- Flexible trigger command configuration

### Features
- Recognizes artist styles from images
- Returns top K classification results
- Configurable confidence threshold
- Support for both CUDA and CPU inference
- Automatic fallback for image fetching
- Detailed error logging

[1.0.3] - 2025-11-03

### Fixed
- Improve image fetching to support data URIs and local file paths when running commands such as `lsnet.testfile`.
- Deduplicate image candidate lookup to avoid duplicate requests and noisy logs.

[1.0.3]: https://github.com/yourusername/koishi-plugin-lsnet/releases/tag/v1.0.3
[1.0.0]: https://github.com/yourusername/koishi-plugin-lsnet/releases/tag/v1.0.0
