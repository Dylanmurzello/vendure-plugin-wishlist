import gql from 'graphql-tag';

/**
 * GraphQL schema extensions for the Shop API.
 * 
 * @description
 * Adds wishlist queries and mutations to the Shop API for customer-facing operations.
 * All operations require authentication and automatically use the active customer.
 */
export const shopApiExtensions = gql`
    type WishlistItem {
        id: ID!
        productVariant: ProductVariant!
        addedAt: DateTime!
        notes: String
    }

    type WishlistItemList {
        items: [WishlistItem!]!
        totalItems: Int!
    }

    extend type Query {
        """
        Get all items in the active customer's wishlist
        """
        wishlistItems: WishlistItemList!
        
        """
        Check if a product variant is in the active customer's wishlist
        """
        isInWishlist(productVariantId: ID!): Boolean!
        
        """
        Get the total count of items in the active customer's wishlist
        """
        wishlistCount: Int!
    }

    extend type Mutation {
        """
        Add a product variant to the active customer's wishlist
        """
        addToWishlist(productVariantId: ID!, notes: String): WishlistItem!
        
        """
        Remove a product variant from the active customer's wishlist
        """
        removeFromWishlist(productVariantId: ID!): Boolean!
        
        """
        Clear all items from the active customer's wishlist
        """
        clearWishlist: Boolean!
    }
`;

/**
 * GraphQL schema extensions for the Admin API.
 * 
 * @description
 * Adds wishlist queries to the Admin API for viewing customer wishlists.
 * Requires ReadCustomer permission.
 */
export const adminApiExtensions = gql`
    type WishlistItem {
        id: ID!
        customer: Customer!
        productVariant: ProductVariant!
        addedAt: DateTime!
        notes: String
    }

    type WishlistItemList {
        items: [WishlistItem!]!
        totalItems: Int!
    }

    extend type Query {
        """
        Get all wishlist items for a specific customer
        """
        customerWishlistItems(customerId: ID!): WishlistItemList!
        
        """
        Get the total count of items in a customer's wishlist
        """
        customerWishlistCount(customerId: ID!): Int!
    }
`;
