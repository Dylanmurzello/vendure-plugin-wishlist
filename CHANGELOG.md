# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2025-09-30

### Added
- 🎉 Initial release of Vendure Wishlist Plugin
- ✨ Shop API queries and mutations for customer wishlist management
- 👑 Admin API queries to view customer wishlists
- 💾 Persistent storage with TypeORM entity
- 🔒 Authentication required for all wishlist operations
- 📝 Optional notes field for wishlist items
- 🚫 Duplicate prevention with unique constraint
- 📊 Pagination support for wishlist queries
- 🧮 Wishlist item count functionality
- 🗑️ Clear entire wishlist functionality
- ✅ Full TypeScript support with type definitions
- 📚 Comprehensive JSDoc documentation

### Features
- `wishlistItems` query - Get all items in customer's wishlist
- `isInWishlist` query - Check if variant is in wishlist
- `wishlistCount` query - Get total wishlist item count
- `addToWishlist` mutation - Add variant to wishlist with optional notes
- `removeFromWishlist` mutation - Remove variant from wishlist
- `clearWishlist` mutation - Clear all wishlist items
- `customerWishlistItems` admin query - View any customer's wishlist
- `customerWishlistCount` admin query - Get any customer's wishlist count

[1.0.0]: https://github.com/Dylanmurzello/vendure-plugin-wishlist/releases/tag/v1.0.0
