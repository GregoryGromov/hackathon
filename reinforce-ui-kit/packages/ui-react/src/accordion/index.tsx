'use client';

import {
  accordionContentClass,
  accordionContentInnerClass,
  accordionItemClass,
  accordionTriggerClass,
  accordionTriggerIconClass,
} from '@reinforce/ui-primitives/accordion';
import { cn } from '@reinforce/ui-styles/cn';
import { ChevronDownIcon } from 'lucide-react';
import { Accordion as AccordionPrimitive } from 'radix-ui';
import type * as React from 'react';

function Accordion({ ...props }: React.ComponentProps<typeof AccordionPrimitive.Root>) {
  return <AccordionPrimitive.Root data-slot="accordion" {...props} />;
}

function AccordionItem({
  className,
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Item>) {
  return (
    <AccordionPrimitive.Item
      data-slot="accordion-item"
      className={cn(accordionItemClass, className)}
      {...props}
    />
  );
}

function AccordionTrigger({
  className,
  children,
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Trigger>) {
  return (
    <AccordionPrimitive.Header className="flex">
      <AccordionPrimitive.Trigger
        data-slot="accordion-trigger"
        className={cn(accordionTriggerClass, className)}
        {...props}
      >
        {children}
        <ChevronDownIcon className={accordionTriggerIconClass} strokeWidth={1.75} />
      </AccordionPrimitive.Trigger>
    </AccordionPrimitive.Header>
  );
}

function AccordionContent({
  className,
  children,
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Content>) {
  return (
    <AccordionPrimitive.Content
      data-slot="accordion-content"
      className={accordionContentClass}
      {...props}
    >
      <div className={cn(accordionContentInnerClass, className)}>{children}</div>
    </AccordionPrimitive.Content>
  );
}

export {
  accordionContentClass,
  accordionContentInnerClass,
  accordionItemClass,
  accordionTriggerClass,
  accordionTriggerIconClass,
} from '@reinforce/ui-primitives/accordion';
export { Accordion, AccordionContent, AccordionItem, AccordionTrigger };
