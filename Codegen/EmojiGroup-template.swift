//
//  EmojiGroup.swift
//
//  Created by Yubo Qin on 8/17/22.
//

import Foundation

extension FluentUIEmoji {

    public enum Group: CaseIterable {

        /// Groups
        case unknown

    }

    /// Gets an array of emojis with a given group.
    /// - Parameter group: Group of emojis.
    /// - Returns: An array of emojis that belong to given group.
    public static func emojis(for group: Group) -> [FluentUIEmoji] {
        switch group {
        /// Switch
        default:
            return []
        }
    }

}
