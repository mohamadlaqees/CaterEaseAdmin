import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown } from "lucide-react";

export const MultiSelect = ({
  options,
  selected,
  onChange,
  className,
  placeholder = "Select options",
}) => {
  const [open, setOpen] = useState(false);

  const handleSelect = (value) => {
    const newSelected = selected.includes(value)
      ? selected?.filter((item) => item !== value)
      : [...selected, value];
    onChange(newSelected);
  };

  // Get the display names of the selected options
  const selectedLabels = options
    ?.filter((option) => {
      if (selected) {
        return selected.includes(option.id);
      }
    })
    .map((option) => option.name)
    .join(", ");

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={`w-full justify-between font-normal ${className}`}
        >
          <span className="truncate">
            {selectedLabels?.length > 0 ? selectedLabels : placeholder}
          </span>
          <ChevronDown className="h-4 w-4 opacity-50" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-full">
        {options?.map((option) => (
          <DropdownMenuItem
            key={option.id}
            // Prevent the dropdown from closing when an item is clicked
            onSelect={(e) => e.preventDefault()}
            onClick={() => handleSelect(option.id)}
            className="cursor-pointer"
          >
            <Checkbox
              checked={selected ? selected.includes(option.id) : ""}
              className="mr-2"
            />
            <span>{option.name}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
