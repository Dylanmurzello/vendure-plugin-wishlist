# 🎯 Vendure Wishlist Plugin

A full-featured wishlist/favorites plugin for [Vendure](https://www.vendure.io/) e-commerce framework. Let your customers save products for later with persistent storage and a clean GraphQL API.

[![npm version](https://img.shields.io/npm/v/@dylanmurzello/vendure-plugin-wishlist.svg)](https://www.npmjs.com/package/@dylanmurzello/vendure-plugin-wishlist)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## ✨ Features

- 🛍️ **Customer Wishlists** - Let customers save products they want to buy later
- 🔒 **Authentication** - Secure wishlist operations for logged-in users only
- 💾 **Persistent Storage** - Wishlists stored in database, survive across sessions
- 📝 **Notes Support** - Optional notes field for each wishlist item
- 🚫 **Duplicate Prevention** - Unique constraint prevents duplicate entries
- 📊 **Pagination** - Built-in pagination support for large wishlists
- 👑 **Admin API** - View customer wishlists from admin panel
- 🎨 **GraphQL API** - Clean, type-safe GraphQL mutations and queries
- 📚 **TypeScript** - Full TypeScript support with type definitions
- 🔥 **Zero Config** - Just add to plugins array and you're good to go

## 📦 Installation

```bash
npm install @dylanmurzello/vendure-plugin-wishlist
# or
yarn add @dylanmurzello/vendure-plugin-wishlist
# or
pnpm add @dylanmurzello/vendure-plugin-wishlist
```

## 🚀 Quick Start

### 1. Add to Vendure Config

```typescript
import { WishlistPlugin } from '@dylanmurzello/vendure-plugin-wishlist';

const config: VendureConfig = {
  // ... other config
  plugins: [
    WishlistPlugin,
    // ... other plugins
  ],
};
```

### 2. Run Database Migration

The plugin will automatically create the `wishlist_item` table on first run. If you're using migrations:

```bash
npm run migration:generate add-wishlist
npm run migration:run
```

### 3. Start Using!

That's it! The plugin is now active and your customers can start building wishlists.

## 📖 Usage

### Shop API (Customer-Facing)

All Shop API operations require authentication and automatically use the active customer.

#### Get Wishlist Items

```graphql
query {
  wishlistItems {
    items {
      id
      productVariant {
        id
        name
        sku
        price
        product {
          name
          featuredAsset {
            preview
          }
        }
      }
      addedAt
      notes
    }
    totalItems
  }
}
```

#### Add to Wishlist

```graphql
mutation {
  addToWishlist(
    productVariantId: "123"
    notes: "Birthday gift for mom"
  ) {
    id
    productVariant {
      name
    }
    addedAt
  }
}
```

#### Remove from Wishlist

```graphql
mutation {
  removeFromWishlist(productVariantId: "123")
}
```

#### Check if Item is in Wishlist

```graphql
query {
  isInWishlist(productVariantId: "123")
}
```

#### Get Wishlist Count

```graphql
query {
  wishlistCount
}
```

#### Clear Entire Wishlist

```graphql
mutation {
  clearWishlist
}
```

### Admin API

Admin operations require `ReadCustomer` permission.

#### View Customer Wishlist

```graphql
query {
  customerWishlistItems(customerId: "456") {
    items {
      id
      productVariant {
        name
        sku
      }
      customer {
        emailAddress
        firstName
        lastName
      }
      addedAt
      notes
    }
    totalItems
  }
}
```

#### Get Customer Wishlist Count

```graphql
query {
  customerWishlistCount(customerId: "456")
}
```

## 🎨 Frontend Integration

### React Example with Apollo Client

```typescript
import { useMutation, useQuery } from '@apollo/client';
import gql from 'graphql-tag';

const GET_WISHLIST = gql`
  query GetWishlist {
    wishlistItems {
      items {
        id
        productVariant {
          id
          name
          product {
            name
            featuredAsset {
              preview
            }
          }
        }
      }
      totalItems
    }
  }
`;

const ADD_TO_WISHLIST = gql`
  mutation AddToWishlist($productVariantId: ID!, $notes: String) {
    addToWishlist(productVariantId: $productVariantId, notes: $notes) {
      id
    }
  }
`;

function WishlistButton({ productVariantId }) {
  const { data } = useQuery(GET_WISHLIST);
  const [addToWishlist] = useMutation(ADD_TO_WISHLIST, {
    refetchQueries: [{ query: GET_WISHLIST }],
  });

  const isInWishlist = data?.wishlistItems?.items?.some(
    item => item.productVariant.id === productVariantId
  );

  return (
    <button
      onClick={() => addToWishlist({ variables: { productVariantId } })}
      className={isInWishlist ? 'active' : ''}
    >
      {isInWishlist ? '❤️ In Wishlist' : '🤍 Add to Wishlist'}
    </button>
  );
}
```

### Next.js Example

```typescript
'use client';

import { useState } from 'react';

export function WishlistButton({ variantId }: { variantId: string }) {
  const [inWishlist, setInWishlist] = useState(false);

  const toggleWishlist = async () => {
    const mutation = inWishlist ? 'removeFromWishlist' : 'addToWishlist';
    
    const response = await fetch('/shop-api', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        query: `
          mutation {
            ${mutation}(productVariantId: "${variantId}") ${
              inWishlist ? '' : '{ id }'
            }
          }
        `,
      }),
    });

    if (response.ok) {
      setInWishlist(!inWishlist);
    }
  };

  return (
    <button onClick={toggleWishlist}>
      {inWishlist ? '❤️ In Wishlist' : '🤍 Add to Wishlist'}
    </button>
  );
}
```

## 🏗️ Architecture

### Database Schema

The plugin creates a `wishlist_item` table with the following structure:

| Column | Type | Description |
|--------|------|-------------|
| `id` | ID | Primary key |
| `customerId` | ID | Foreign key to customer |
| `productVariantId` | ID | Foreign key to product variant |
| `addedAt` | DateTime | Timestamp when item was added |
| `notes` | String | Optional notes (nullable) |

**Unique Constraint:** `(customerId, productVariantId)` - Prevents duplicate entries.

### Service Methods

The `WishlistService` provides the following methods:

```typescript
class WishlistService {
  // Get paginated wishlist items
  getWishlistItems(ctx: RequestContext, customerId: ID, options?: ListQueryOptions): Promise<PaginatedList<WishlistItem>>
  
  // Add item to wishlist (updates notes if already exists)
  addToWishlist(ctx: RequestContext, customerId: ID, productVariantId: ID, notes?: string): Promise<WishlistItem>
  
  // Remove item from wishlist
  removeFromWishlist(ctx: RequestContext, customerId: ID, productVariantId: ID): Promise<boolean>
  
  // Clear all items
  clearWishlist(ctx: RequestContext, customerId: ID): Promise<boolean>
  
  // Check if item is in wishlist
  isInWishlist(ctx: RequestContext, customerId: ID, productVariantId: ID): Promise<boolean>
  
  // Get total count
  getWishlistCount(ctx: RequestContext, customerId: ID): Promise<number>
}
```

## 🔧 Advanced Usage

### Using the Service Directly

You can inject `WishlistService` into your own plugins or resolvers:

```typescript
import { WishlistService } from '@gbros/vendure-plugin-wishlist';

@Injectable()
export class MyCustomService {
  constructor(private wishlistService: WishlistService) {}

  async checkCustomerInterest(ctx: RequestContext, customerId: ID) {
    const count = await this.wishlistService.getWishlistCount(ctx, customerId);
    return count > 5; // Customer is highly engaged!
  }
}
```

### Custom Resolvers

Extend the plugin's functionality with your own resolvers:

```typescript
@Resolver()
export class CustomWishlistResolver {
  constructor(private wishlistService: WishlistService) {}

  @Query()
  @Allow(Permission.Authenticated)
  async popularWishlistItems(@Ctx() ctx: RequestContext) {
    // Implement your own logic
    // Query all wishlist items and aggregate by product
  }
}
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built for the [Vendure](https://www.vendure.io/) e-commerce framework
- Inspired by real-world e-commerce needs
- Developed with ❤️

## 📮 Support

- 🐛 [Report a bug](https://github.com/Dylanmurzello/vendure-plugin-wishlist/issues)
- 💡 [Request a feature](https://github.com/Dylanmurzello/vendure-plugin-wishlist/issues)
- 💬 [Ask a question](https://github.com/Dylanmurzello/vendure-plugin-wishlist/discussions)

## 🔗 Links

- [Vendure Documentation](https://www.vendure.io/docs/)
- [Vendure Plugin Guide](https://www.vendure.io/docs/plugins/)
- [npm Package](https://www.npmjs.com/package/@dylanmurzello/vendure-plugin-wishlist)
- [GitHub Repository](https://github.com/Dylanmurzello/vendure-plugin-wishlist)

---

Made with 🔥 by Dylan Murzello | Supporting your "I'll buy it later" customers since 2025
