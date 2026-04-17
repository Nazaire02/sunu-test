import { Search, FileX, Package, Filter, RefreshCw } from 'lucide-react'
import React from 'react'

interface EmptyStateProps {
  title?: string;
  description?: string;
  variant?: "search" | "noData" | "filter" | "error";
  actionButton?: {
    label: string;
    onClick: () => void;
  };
  size?: "sm" | "md" | "lg";
}

function EmptyState({ 
  title = "Aucune donnée trouvée",
  description = "",
  variant = "search",
  actionButton,
  size = "md"
}: EmptyStateProps) {
  const sizeConfig = {
    sm: {
      icon: "w-16 h-16",
      padding: "py-8",
      titleText: "text-lg",
      descText: "text-sm"
    },
    md: {
      icon: "w-20 h-20",
      padding: "py-12",
      titleText: "text-xl",
      descText: "text-base"
    },
    lg: {
      icon: "w-24 h-24",
      padding: "py-16",
      titleText: "text-2xl",
      descText: "text-lg"
    }
  };

  const variantConfig = {
    search: {
      icon: Search,
      iconColor: "text-blue-400",
      bgColor: "bg-blue-50",
      title: title || "Aucun résultat trouvé",
      description: description || "Essayez de modifier vos critères de recherche"
    },
    noData: {
      icon: Package,
      iconColor: "text-gray-400",
      bgColor: "bg-gray-50",
      title: title || "Aucune donnée disponible",
      description: description || "Il n'y a pas encore de contenu à afficher"
    },
    filter: {
      icon: Filter,
      iconColor: "text-purple-400",
      bgColor: "bg-purple-50",
      title: title || "Aucun élément correspondant",
      description: description || "Essayez d'ajuster vos filtres"
    },
    error: {
      icon: FileX,
      iconColor: "text-red-400",
      bgColor: "bg-red-50",
      title: title || "Erreur de chargement",
      description: description || "Une erreur s'est produite lors du chargement"
    }
  };

  const config = variantConfig[variant];
  const sizeConf = sizeConfig[size];
  const IconComponent = config.icon;

  return (
    <div className={`flex flex-col items-center justify-center ${sizeConf.padding} space-y-3`}>
      <div className="relative group">
        <div className={`${sizeConf.icon} ${config.bgColor} rounded-full flex items-center justify-center transition-all duration-300 group-hover:scale-105`}>
          <IconComponent className={`${config.iconColor} transition-all duration-300`} size={size === 'sm' ? 32 : size === 'lg' ? 48 : 40} />
        </div>
        <div className={`absolute inset-0 ${config.bgColor} rounded-full opacity-30 animate-pulse`}></div>
      </div>
      <div className="text-center space-y-2 max-w-sm">
        <h3 className={`${sizeConf.titleText} font-semibold text-gray-800`}>
          {config.title}
        </h3>
        <p className={`${sizeConf.descText} text-gray-500 leading-relaxed`}>
          {config.description}
        </p>
      </div>
      {actionButton && (
        <button
          onClick={actionButton.onClick}
          className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 shadow-sm hover:shadow-md group"
        >
          <RefreshCw className="w-4 h-4 mr-2 group-hover:rotate-180 transition-transform duration-500" />
          {actionButton.label}
        </button>
      )}
    </div>
  );
}

export default EmptyState;