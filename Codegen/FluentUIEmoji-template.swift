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

fileprivate func getImagePath(name: String) -> String {
    guard let path = Bundle.module.path(forResource: name, ofType: "png") else {
        fatalError("File path for \(name) does not exist.")
    }
    return path
}
