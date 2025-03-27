import * as React from "react";
import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";

import { buttonSizes, buttonVariants } from "@/components/ui/button";
import type { ButtonProps } from "@/components/ui/button";

const Pagination = ({ className, ...props }: React.ComponentProps<"nav">) => (
  <nav
    role="navigation"
    aria-label="pagination"
    className={`mx-auto flex w-full justify-center ${className || ""}`}
    {...props}
  />
);
Pagination.displayName = "Pagination";

const PaginationContent = React.forwardRef<
  HTMLUListElement,
  React.ComponentProps<"ul">
>(({ className, ...props }, ref) => (
  <ul
    ref={ref}
    className={`flex flex-row items-center gap-1 ${className || ""}`}
    {...props}
  />
));
PaginationContent.displayName = "PaginationContent";

const PaginationItem = React.forwardRef<
  HTMLLIElement,
  React.ComponentProps<"li">
>(({ className, ...props }, ref) => (
  <li ref={ref} className={className || ""} {...props} />
));
PaginationItem.displayName = "PaginationItem";

type PaginationLinkProps = {
  isActive?: boolean;
} & Pick<ButtonProps, "size"> &
  React.ComponentProps<"a">;

const PaginationLink = ({
  className,
  isActive,
  size = "icon",
  ...props
}: PaginationLinkProps) => {
  const baseButtonClasses = `${isActive ? buttonVariants["link"] : buttonVariants["ghost"]} 
  ${buttonSizes[size]} ${isActive ? "cursor-default" : "cursor-pointer"}`;

  return (
    <a
      aria-current={isActive ? "page" : undefined}
      className={`${baseButtonClasses} ${className || ""}`}
      {...props}
    />
  );
};
PaginationLink.displayName = "PaginationLink";

const PaginationPrevious = ({
  className,
  ...props
}: React.ComponentProps<typeof PaginationLink>) => (
  <PaginationLink
    aria-label="Go to previous page"
    size="default"
    className={`
      group flex items-center gap-1 
      hover:bg-accent hover:text-accent-foreground 
      focus:bg-accent focus:text-accent-foreground
      transition-colors duration-200 
      px-2 py-1 rounded-md
      ${className || ""}`}
    {...props}
  >
    <ChevronLeft className="h-3 w-3 inline-flex items-center" />
    <span className="inline-flex items-center pr-5">Previous</span>
  </PaginationLink>
);
PaginationPrevious.displayName = "PaginationPrevious";

const PaginationNext = ({
  className,
  ...props
}: React.ComponentProps<typeof PaginationLink>) => (
  <PaginationLink
    aria-label="Go to next page"
    size="default"
    className={`
      group flex items-center gap-1 
      hover:bg-accent hover:text-accent-foreground 
      focus:bg-accent focus:text-accent-foreground
      transition-colors duration-200 
      px-2 py-1 rounded-md
      ${className || ""}`}
    {...props}
  >
    <span className="inline-flex items-center pl-5">Next</span>
    <ChevronRight className="h-3 w-3 inline-flex items-center" />
  </PaginationLink>
);
PaginationNext.displayName = "PaginationNext";

const PaginationEllipsis = ({
  className,
  ...props
}: React.ComponentProps<"span">) => (
  <span
    aria-hidden
    className={`flex h-9 w-9 items-center justify-center ${className || ""}`}
    {...props}
  >
    <MoreHorizontal className="h-4 w-4" />
    <span className="sr-only">More pages</span>
  </span>
);
PaginationEllipsis.displayName = "PaginationEllipsis";

export {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
};
