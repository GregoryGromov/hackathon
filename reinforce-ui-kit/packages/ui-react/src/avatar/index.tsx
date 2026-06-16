'use client';

import {
  avatarBadgeClass,
  avatarFallbackClass,
  avatarGroupClass,
  avatarGroupCountClass,
  avatarImageClass,
  avatarRootClass,
} from '@reinforce/ui-primitives/avatar';
import { cn } from '@reinforce/ui-styles/cn';
import { Avatar as AvatarPrimitive } from 'radix-ui';
import type * as React from 'react';

function Avatar({
  className,
  size = 'default',
  ...props
}: React.ComponentProps<typeof AvatarPrimitive.Root> & {
  size?: 'default' | 'sm' | 'lg';
}) {
  return (
    <AvatarPrimitive.Root
      data-slot="avatar"
      data-size={size}
      className={cn(avatarRootClass, className)}
      {...props}
    />
  );
}

function AvatarImage({ className, ...props }: React.ComponentProps<typeof AvatarPrimitive.Image>) {
  return (
    <AvatarPrimitive.Image
      data-slot="avatar-image"
      className={cn(avatarImageClass, className)}
      {...props}
    />
  );
}

function AvatarFallback({
  className,
  ...props
}: React.ComponentProps<typeof AvatarPrimitive.Fallback>) {
  return (
    <AvatarPrimitive.Fallback
      data-slot="avatar-fallback"
      className={cn(avatarFallbackClass, className)}
      {...props}
    />
  );
}

function AvatarBadge({ className, ...props }: React.ComponentProps<'span'>) {
  return <span data-slot="avatar-badge" className={cn(avatarBadgeClass, className)} {...props} />;
}

function AvatarGroup({ className, ...props }: React.ComponentProps<'div'>) {
  return <div data-slot="avatar-group" className={cn(avatarGroupClass, className)} {...props} />;
}

function AvatarGroupCount({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="avatar-group-count"
      className={cn(avatarGroupCountClass, className)}
      {...props}
    />
  );
}

export { Avatar, AvatarBadge, AvatarFallback, AvatarGroup, AvatarGroupCount, AvatarImage };
