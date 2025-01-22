"use client";

import { Button } from "@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.

export const columns = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "FirstName",
    header: "First name",
  },
  {
    accessorKey: "LastName",
    header: "Last name",
  },
  {
    accessorKey: "ShowcaseName",
    header: "Showcase name",
  },
  {
    accessorKey: "DateOfBirth",
    header: "Date of birth",
  },
  {
    accessorKey: "Height",
    header: "Height",
  },
  {
    accessorKey: "BustChest",
    header: "Bust / Chest",
  },
  {
    accessorKey: "Waist",
    header: "Waist",
  },
  {
    accessorKey: "Hips",
    header: "Hips",
  },
  {
    accessorKey: "Shoes",
    header: "Shoes",
  },
  {
    accessorKey: "Eyes",
    header: "Eyes",
  },
  {
    accessorKey: "Hair",
    header: "Hair",
  },
  {
    accessorKey: "Piercings",
    header: "Piercings",
  },
  {
    accessorKey: "BraSize",
    header: "Bra size",
  },
  {
    accessorKey: "SuitSize",
    header: "Suit size",
  },
  {
    accessorKey: "DressSize",
    header: "Dress size",
  },
  {
    accessorKey: "Ethnicity",
    header: "Ethnicity",
  },
  // {
  //   accessorKey: "status",
  //   header: "Status",
  // },
  // {
  //   accessorKey: "email",
  //   header: "Email",
  //   header: ({ column }) => {
  //     return (
  //       <Button
  //         variant="ghost"
  //         onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
  //       >
  //         Email
  //         <ArrowUpDown className="ml-2 h-4 w-4" />
  //       </Button>
  //     );
  //   },
  // },
  // {
  //   accessorKey: "amount",
  //   header: () => <div className="text-right">Amount</div>,
  //   cell: ({ row }) => {
  //     const amount = parseFloat(row.getValue("amount"));
  //     const formatted = new Intl.NumberFormat("en-US", {
  //       style: "currency",
  //       currency: "USD",
  //     }).format(amount);

  //     return <div className="text-right font-medium">{formatted}</div>;
  //   },
  // },
];
