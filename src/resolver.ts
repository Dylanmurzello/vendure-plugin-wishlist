import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import {
    Ctx,
    RequestContext,
    ID,
    Allow,
    Permission,
    Transaction,
    CustomerService,
} from '@vendure/core';
import { WishlistService } from './service';

/**
 * GraphQL resolver for Shop API wishlist operations.
 * 
 * @description
 * Handles all customer-facing wishlist queries and mutations.
 * Automatically retrieves the active customer from the request context.
 */
@Resolver()
export class WishlistShopResolver {
    constructor(
        private wishlistService: WishlistService,
        private customerService: CustomerService,
    ) {}

    @Query()
    @Allow(Permission.Authenticated)
    async wishlistItems(@Ctx() ctx: RequestContext) {
        const userId = ctx.activeUserId;
        if (!userId) {
            return { items: [], totalItems: 0 };
        }

        const customer = await this.customerService.findOneByUserId(ctx, userId);
        if (!customer) {
            return { items: [], totalItems: 0 };
        }

        return this.wishlistService.getWishlistItems(ctx, customer.id);
    }

    @Query()
    @Allow(Permission.Authenticated)
    async isInWishlist(
        @Ctx() ctx: RequestContext,
        @Args() args: { productVariantId: ID }
    ): Promise<boolean> {
        const userId = ctx.activeUserId;
        if (!userId) {
            return false;
        }

        const customer = await this.customerService.findOneByUserId(ctx, userId);
        if (!customer) {
            return false;
        }

        return this.wishlistService.isInWishlist(ctx, customer.id, args.productVariantId);
    }

    @Query()
    @Allow(Permission.Authenticated)
    async wishlistCount(@Ctx() ctx: RequestContext): Promise<number> {
        const userId = ctx.activeUserId;
        if (!userId) {
            return 0;
        }

        const customer = await this.customerService.findOneByUserId(ctx, userId);
        if (!customer) {
            return 0;
        }

        return this.wishlistService.getWishlistCount(ctx, customer.id);
    }

    @Mutation()
    @Transaction()
    @Allow(Permission.Authenticated)
    async addToWishlist(
        @Ctx() ctx: RequestContext,
        @Args() args: { productVariantId: ID; notes?: string }
    ) {
        const userId = ctx.activeUserId;
        if (!userId) {
            throw new Error('User must be logged in to add items to wishlist');
        }

        const customer = await this.customerService.findOneByUserId(ctx, userId);
        if (!customer) {
            throw new Error('Customer not found');
        }

        return this.wishlistService.addToWishlist(
            ctx,
            customer.id,
            args.productVariantId,
            args.notes
        );
    }

    @Mutation()
    @Transaction()
    @Allow(Permission.Authenticated)
    async removeFromWishlist(
        @Ctx() ctx: RequestContext,
        @Args() args: { productVariantId: ID }
    ): Promise<boolean> {
        const userId = ctx.activeUserId;
        if (!userId) {
            return false;
        }

        const customer = await this.customerService.findOneByUserId(ctx, userId);
        if (!customer) {
            return false;
        }

        return this.wishlistService.removeFromWishlist(ctx, customer.id, args.productVariantId);
    }

    @Mutation()
    @Transaction()
    @Allow(Permission.Authenticated)
    async clearWishlist(@Ctx() ctx: RequestContext): Promise<boolean> {
        const userId = ctx.activeUserId;
        if (!userId) {
            return false;
        }

        const customer = await this.customerService.findOneByUserId(ctx, userId);
        if (!customer) {
            return false;
        }

        return this.wishlistService.clearWishlist(ctx, customer.id);
    }
}

/**
 * GraphQL resolver for Admin API wishlist operations.
 * 
 * @description
 * Allows admins to view customer wishlists.
 * Requires ReadCustomer permission.
 */
@Resolver()
export class WishlistAdminResolver {
    constructor(private wishlistService: WishlistService) {}

    @Query()
    @Allow(Permission.ReadCustomer)
    async customerWishlistItems(
        @Ctx() ctx: RequestContext,
        @Args() args: { customerId: ID }
    ) {
        return this.wishlistService.getWishlistItems(ctx, args.customerId);
    }

    @Query()
    @Allow(Permission.ReadCustomer)
    async customerWishlistCount(
        @Ctx() ctx: RequestContext,
        @Args() args: { customerId: ID }
    ): Promise<number> {
        return this.wishlistService.getWishlistCount(ctx, args.customerId);
    }
}
