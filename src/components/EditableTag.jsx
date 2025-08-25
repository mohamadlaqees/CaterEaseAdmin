import { X } from "lucide-react";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FormControl, FormItem, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const EditableTag = ({ field, title }) => {
  const [inputValue, setInputValue] = useState("");

  const handleAddTag = () => {
    if (inputValue && !field.value.includes(inputValue)) {
      field.onChange([...field.value, inputValue]);
      setInputValue(""); // Clear input after adding
    }
  };
  const handleRemoveTag = (indexToRemove) => {
    field.onChange(field.value.filter((_, index) => index !== indexToRemove));
  };
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddTag();
    }
  };

  return (
    <Card className="shadow-sm border">
      <CardHeader>
        <CardTitle className="text-lg text-(--primaryFont)">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <FormItem>
          <div className="flex flex-wrap gap-2 mb-4">
            {/* We now map over field.value, which is the string array */}
            {field.value.map((tag, index) => (
              <div
                key={`${tag}-${index}`} // Create a stable key
                className="flex items-center bg-gray-200 rounded-full px-3 py-1 text-sm"
              >
                <span className="text-(--secondaryFont)">{tag}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveTag(index)}
                  className="ml-2 text-gray-500 hover:text-red-500 cursor-pointer"
                >
                  <X size={16} />
                </button>
              </div>
            ))}
          </div>
          <div className="flex gap-2">
            <FormControl>
              <Input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={`Add a new ${title.toLowerCase().slice(0, -1)}...`}
                className="text-(--secondaryFont)"
              />
            </FormControl>
            <Button
              type="button"
              className="cursor-pointer"
              onClick={handleAddTag}
            >
              Add
            </Button>
          </div>
          <FormMessage />
        </FormItem>
      </CardContent>
    </Card>
  );
};

export default EditableTag;
