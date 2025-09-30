// 🔥 WISHLIST PLUGIN - Custom Vendure plugin for wishlist functionality
// Created: 2025-09-26 - Full-featured wishlist system for e-commerce stores
// Features: Add/remove items, persist across sessions, GraphQL API integration
// This plugin extends Vendure with custom wishlist functionality that slaps harder than a wet trophy 💀

import { PluginCommonModule, VendurePlugin } from '@vendure/core';
import { WishlistItem } from './entity';
import { WishlistService } from './service';
import { WishlistShopResolver, WishlistAdminResolver } from './resolver';
import { shopApiExtensions, adminApiExtensions } from './api-extensions';

/**
 * @description
 * A Vendure plugin that adds wishlist/favorites functionality to your store.
 * 
 * @example
 * ```ts
 * import { WishlistPlugin } from '@gbros/vendure-plugin-wishlist';
 * 
 * const config: VendureConfig = {
 *   // ... other config
 *   plugins: [
 *     WishlistPlugin,
 *     // ... other plugins
 *   ],
 * };
 * ```
 * 
 * ## Features
 * 
 * - ✅ **Shop API** - Customers can add/remove items to their wishlist
 * - ✅ **Admin API** - Admins can view customer wishlists
 * - ✅ **Persistent** - Wishlists are stored in the database
 * - ✅ **Authenticated** - Only logged-in users can manage wishlists
 * - ✅ **Notes Support** - Optional notes field for each wishlist item
 * - ✅ **Duplicate Prevention** - Unique constraint prevents duplicate entries
 * 
 * ## Shop API Usage
 * 
 * ### Query wishlist items
 * ```graphql
 * query {
 *   wishlistItems {
 *     items {
 *       id
 *       productVariant {
 *         id
 *         name
 *         price
 *       }
 *       addedAt
 *       notes
 *     }
 *     totalItems
 *   }
 * }
 * ```
 * 
 * ### Add to wishlist
 * ```graphql
 * mutation {
 *   addToWishlist(productVariantId: "123", notes: "Birthday gift") {
 *     id
 *     productVariant {
 *       name
 *     }
 *   }
 * }
 * ```
 * 
 * ### Remove from wishlist
 * ```graphql
 * mutation {
 *   removeFromWishlist(productVariantId: "123")
 * }
 * ```
 * 
 * ### Check if item is in wishlist
 * ```graphql
 * query {
 *   isInWishlist(productVariantId: "123")
 * }
 * ```
 * 
 * ## Admin API Usage
 * 
 * ### View customer wishlist
 * ```graphql
 * query {
 *   customerWishlistItems(customerId: "456") {
 *     items {
 *       id
 *       productVariant {
 *         name
 *       }
 *       customer {
 *         emailAddress
 *       }
 *       addedAt
 *     }
 *     totalItems
 *   }
 * }
 * ```
 * 
 * @docsCategory plugins
 * @docsPage WishlistPlugin
 */
@VendurePlugin({
    imports: [PluginCommonModule],
    entities: [WishlistItem],
    providers: [WishlistService],
    shopApiExtensions: {
        schema: shopApiExtensions,
        resolvers: [WishlistShopResolver],
    },
    adminApiExtensions: {
        schema: adminApiExtensions,
        resolvers: [WishlistAdminResolver],
    },
})
export class WishlistPlugin {}
