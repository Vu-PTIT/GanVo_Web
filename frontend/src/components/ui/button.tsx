import * as React from "react";
import { cn } from "@/lib/utils";

function Button({ className, ...props }: React.ComponentProps<"button">) {
  return (
    <button
      className={cn(
        "btn-basic",
        className
      )}
      {...props}
    />
  );
}

export { Button };
