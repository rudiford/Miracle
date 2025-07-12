"use client"

import * as React from "react"

// Tooltip components temporarily disabled due to React hooks error
// This file exports empty components to prevent import errors

const TooltipProvider = ({ children }: { children: React.ReactNode }) => <>{children}</>;
const Tooltip = ({ children }: { children: React.ReactNode }) => <>{children}</>;
const TooltipTrigger = ({ children }: { children: React.ReactNode; asChild?: boolean }) => <>{children}</>;
const TooltipContent = ({ children }: { children: React.ReactNode; [key: string]: any }) => null;

export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider };
