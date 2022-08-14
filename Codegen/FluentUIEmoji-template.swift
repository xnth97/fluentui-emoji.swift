import Foundation
#if canImport(UIKit)
import UIKit
#elseif canImport(AppKit)
import AppKit
#endif

public struct FluentUIEmoji {
    #if canImport(UIKit)
    /// UIImage
    #elseif canImport(AppKit)
    /// NSImage
    #endif
}

#if canImport(SwiftUI)
import SwiftUI

public struct FluentUIEmojiSwiftUI {
    /// SwiftUI
}
#endif
