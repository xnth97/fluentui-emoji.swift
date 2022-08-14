// swift-tools-version: 5.6
// The swift-tools-version declares the minimum version of Swift required to build this package.

import PackageDescription

let package = Package(
    name: "FluentUIEmoji",
    platforms: [
        .macOS(.v10_15),
        .iOS(.v13),
        .watchOS(.v6),
        .tvOS(.v13),
    ],
    products: [
        .library(
            name: "FluentUIEmoji",
            targets: ["FluentUIEmoji"]),
    ],
    dependencies: [
    ],
    targets: [
        .target(
            name: "FluentUIEmoji",
            dependencies: [],
            path: "Sources/FluentUIEmoji",
            resources: [
                .process("Resources")
            ]),
        .testTarget(
            name: "FluentUIEmojiTests",
            dependencies: ["FluentUIEmoji"]),
    ]
)
