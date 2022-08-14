# fluentui-emoji.swift

A type-safe auto-generated Swift wrapper around [fluentui-emoji](https://github.com/microsoft/fluentui-emoji).

![](https://img.shields.io/badge/License-MIT-green)
![](https://img.shields.io/badge/Platform-iOS%20%7C%20macOS%20%7C%20tvOS%20%7C%20watchOS-blue)

![](/Screenshots/1.png)

## Usage

### Requirements

* iOS 13+
* macOS 10.15+
* tvOS 13+
* watchOS 6+

### Installation

fluentui-emoji.swift is distributed as a Swift package. Add this repo to your project through Xcode GUI or `Package.swift`.

```swift
dependencies: [
    .package(url: "https://github.com/xnth97/fluentui-emoji.swift.git", .upToNextMajor(from: "1.0.0"))
]
```

### Example

```swift
import FluentUIEmoji

/// AppKit or UIKit
let image = FluentUIEmoji.smilingFace

/// SwiftUI
FluentUIEmojiSwiftUI.smilingFace
    .resizable()
    .frame(width: 128, height: 128)
```

## Codegen

Run codegen script to sync with [fluentui-emoji](https://github.com/microsoft/fluentui-emoji) repo updates.

```sh
cd Codegen
npm install --save
node index.js
```

## TODO

- [x] SwiftUI support
- [x] Build as XCAssets
- [ ] Load on demand
- [x] Codegen testing
- [ ] Categories
- [ ] Picker GUI

## License

fluentui-emoji.swift is available under the MIT license. See the [LICENSE](LICENSE) file for more info.
