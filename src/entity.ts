// 💾 WISHLIST ENTITY - Database model for wishlist items
// Created: 2025-09-26 - Tracks customer wishlist items with proper relations
// Structure: Links customers to product variants they want but haven't bought yet
// Because window shopping is an art form and we're supporting the artists 🎨

import { Entity, Column, ManyToOne, Index, CreateDateColumn } from 'typeorm';
import { DeepPartial, VendureEntity, ID, ProductVariant, Customer } from '@vendure/core';

/**
 * Represents a single item in a customer's wishlist.
 * 
 * @description
 * Each wishlist item links a customer to a product variant they're interested in.
 * The unique index ensures customers can't add the same variant multiple times.
 * 
 * @example
 * ```ts
 * const wishlistItem = new WishlistItem({
 *   customer: { id: customerId },
 *   productVariant: { id: variantId },
 *   notes: 'Birthday gift idea'
 * });
 * ```
 */
@Entity()
@Index(['customer', 'productVariant'], { unique: true })
export class WishlistItem extends VendureEntity {
    constructor(input?: DeepPartial<WishlistItem>) {
        super(input);
    }

    @ManyToOne(type => Customer, { eager: true, onDelete: 'CASCADE' })
    customer: Customer;

    @ManyToOne(type => ProductVariant, { eager: true, onDelete: 'CASCADE' })
    productVariant: ProductVariant;

    @CreateDateColumn()
    addedAt: Date;

    @Column({ type: 'text', nullable: true })
    notes?: string;
}
