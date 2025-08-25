import { PlusCircle, Trash2 } from "lucide-react";
import { useFieldArray } from "react-hook-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const EditableTable = ({
  control,
  name,
  title,
  columns,
  newRowObject,
  extraData,
}) => {
  const { fields, append, remove } = useFieldArray({ control, name });
  const canAddMore = name === "working_hours" ? fields.length < 7 : true;

  const handleAddRow = () => {
    if (name === "working_hours") {
      const nextDayIndex = fields.length;
      const nextDay = extraData[nextDayIndex];

      append({
        day: nextDay,
        open_time: "",
        close_time: "",
      });
    } else {
      append(newRowObject);
    }
  };
  return (
    <Card className="shadow-sm border">
      <CardHeader>
        <CardTitle className="text-lg text-(--primaryFont)">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {fields.map((field, index) => (
            <div
              key={field.id}
              className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end border-b pb-4 last:border-none"
            >
              <div className="md:col-span-3 grid grid-cols-1 sm:grid-cols-3 gap-4">
                {columns.map((col) => (
                  <FormField
                    key={col.key}
                    control={control}
                    name={`${name}.${index}.${col.key}`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-(--primaryFont) font-medium">
                          {col.header}
                        </FormLabel>
                        <FormControl>
                          <Input
                            readOnly={
                              name === "working_hours" && col.key === "day"
                            }
                            type={col.type}
                            {...field}
                            placeholder={col.header}
                            className="text-(--secondaryFont)"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                ))}
              </div>
              <Button
                type="button"
                variant="destructive"
                size="icon"
                onClick={() => remove(index)}
                className="w-10 h-10 cursor-pointer"
              >
                <Trash2 size={16} />
                <span className="sr-only">Remove Row</span>
              </Button>
            </div>
          ))}
          {canAddMore && (
            <Button
              type="button"
              variant="outline"
              onClick={handleAddRow}
              className="mt-4 cursor-pointer"
            >
              <PlusCircle size={16} className="mr-2" /> Add {title.slice(0, -1)}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default EditableTable;
