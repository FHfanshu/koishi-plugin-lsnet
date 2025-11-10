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

## [1.0.4] - 2025-11-03

### Improved
- **配置界面优化**：重构配置页面结构，使用分组方式组织配置项
  - API 配置：端点地址
  - 模型配置：模型名称、设备、topK、阈值
  - 指令配置：触发关键字
  - 调试选项：日志开关
  - ChatLuna 联动：集成配置
- **文档完善**：添加详细的 ChatLuna 集成教程
  - 配置步骤说明
  - 使用场景示例
  - 高级配置指南
  - 故障排除方案
  - 性能优化建议

### Changed
- 配置项描述更加清晰明了
- 为每个配置项添加了详细的使用说明
- threshold 配置项添加了步进值 (0.01)
- 去除文档中 ComfyUI 强绑定的表述，明确 LSNet 后端可以独立运行或使用其他兼容实现

## [1.0.3] - 2025-11-03

### Fixed
- Improve image fetching to support data URIs and local file paths when running commands such as `lsnet.testfile`.
- Deduplicate image candidate lookup to avoid duplicate requests and noisy logs.

[1.0.4]: https://github.com/FHfanshu/koishi-plugin-lsnet/releases/tag/v1.0.4
[1.0.3]: https://github.com/FHfanshu/koishi-plugin-lsnet/releases/tag/v1.0.3
[1.0.0]: https://github.com/FHfanshu/koishi-plugin-lsnet/releases/tag/v1.0.0
