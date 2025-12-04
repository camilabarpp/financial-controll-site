import React from "react";

import { AlertCircle } from "lucide-react";;

export const EmptyDataPage: React.FC<{
    description?: string;
    icon?: React.ReactNode;
}> = ({
    description = "Parece que não há dados para mostrar aqui no momento.",
    icon = <AlertCircle size={36} className="mb-2 text-muted-foreground" />
}) => {
    return (
        <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
            {icon}
            <span className="text-sm text-center">{description}</span>
        </div>
    );
};