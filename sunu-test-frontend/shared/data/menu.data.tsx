"use client"

import { useMemo } from "react"
import {
  GitBranch,
  LayoutDashboard,
} from "lucide-react"

import { MenuGroup } from "../types/menu"

export function useMenuItems(): MenuGroup[] {
  return useMemo(() => {
    const principal: MenuGroup = {
      groupTitle: "Principal",
      items: [
        { title: "Demandes", url: "/", icon: LayoutDashboard },
        { title: "Workflow", url: "/workflow", icon: GitBranch },
      ],
    }

    return [principal]
  }, [])
}