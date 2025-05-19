import { PropsWithChildren } from "react";
import { twMerge } from "tailwind-merge";

interface TooltipProps extends PropsWithChildren {
    text: string;
    classes?: string;
}

function SimpleTooltip({text, children, classes}: TooltipProps) {
    return (
        <div className={twMerge("relative group inline-block cursor-pointer", classes)}>
            {children}

            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block bg-black text-white text-xs rounded py-1 px-2 whitespace-nowrap z-10">
                {text}
            </div>
        </div>
    );
}

export default SimpleTooltip;