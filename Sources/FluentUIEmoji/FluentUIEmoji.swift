//
//  FluentUIEmoji.swift
//
//  Created by Yubo Qin on 8/12/22.
//

import Foundation
#if canImport(UIKit)
import UIKit
public typealias FluentUIEmojiImage = UIImage
#elseif canImport(AppKit)
import AppKit
public typealias FluentUIEmojiImage = NSImage
#endif
#if canImport(SwiftUI)
import SwiftUI
#endif

public struct FluentUIEmoji: Identifiable {

    /// Image of the emoji. `UIImage` for `UIKit` and `NSImage` for `AppKit`.
    public let image: FluentUIEmojiImage

    /// Name of the emoji. Must be unique as this property also serves as ID of `Identifiable` protocol.
    /// Can retrieve an emoji from name by using `FluentUIEmoji.getImage(named:)`.
    public let name: String

    /// Group that this emoji should belong to. Default is `unknown` if not provided.
    public let group: Group

    internal init(name: String, group: Group = .unknown) {
        self.name = name
        self.image = FluentUIEmoji.unwrapGetImage(named: name)
        self.group = group
    }

    #if canImport(SwiftUI)
    /// SwiftUI `Image` of the emoji.
    public var swiftUIImage: Image {
        return Image(name, bundle: Bundle.module)
    }
    #endif

    /// Get a FluentUI emoji image with a given name.
    /// - Parameter name: Given name of emoji.
    /// - Returns: Nullable `UIImage` or `NSImage`.
    public static func getImage(named name: String) -> FluentUIEmojiImage? {
        #if canImport(UIKit)
        return UIImage(named: name, in: Bundle.module, with: nil)
        #elseif canImport(AppKit)
        return Bundle.module.image(forResource: name)
        #endif
    }

    private static func unwrapGetImage(named name: String) -> FluentUIEmojiImage {
        guard let image = FluentUIEmoji.getImage(named: name) else {
            fatalError("[FluentUIEmoji] Image \(name) does not exist.")
        }
        return image
    }

    /// Identifiable
    public var id: String {
        return name
    }

}
