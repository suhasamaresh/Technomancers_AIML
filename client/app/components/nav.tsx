"use client";
import React, { useState } from "react";
import { HoveredLink, Menu, MenuItem } from "./ui/navbar-menu"; // Assuming you're using this from your provided code
import { cn } from "../lib/utils";

export function NavbarDemo() {
  return (
    <div className="relative w-full flex items-center justify-center">
      <Navbar className="top-2" />
    </div>
  );
}

function Navbar({ className }: { className?: string }) {
  const [active, setActive] = useState<string | null>(null);

  return (
    <div
      className={cn(
        "fixed top-10 inset-x-0 max-w-2xl mx-auto z-50 ",
        className
      )}
    >
      <Menu setActive={setActive}>
        {/* Borrow Menu */}
        <MenuItem setActive={setActive} active={active} item="Job Search">
          <div className="flex flex-col space-y-4 text-sm ">
            <HoveredLink href="/joblistings">Personalised jobs</HoveredLink>
            <HoveredLink href="/jobs/recommended">Recommended Jobs</HoveredLink>
          </div>
        </MenuItem>

        {/* Lend Menu */}
        <MenuItem setActive={setActive} active={active} item="Skill Assesment">
          <div className="flex flex-col space-y-4 text-sm">
            <HoveredLink href="/skills/assessment">
              Skill Assessment
            </HoveredLink>
            <HoveredLink href="/jobanalysis">
              View Skill Improvement Roadmap
            </HoveredLink>
          </div>
        </MenuItem>

        {/* Whitelist Menu */}
        <MenuItem setActive={setActive} active={active} item="Profile">
          <div className="flex flex-col space-y-4 text-sm">
            <HoveredLink href="/dashboard">View Profile</HoveredLink>
          </div>
        </MenuItem>
      </Menu>
    </div>
  );
}
