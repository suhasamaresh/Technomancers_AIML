"use client";
import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";

const transition = {
  type: "spring",
  mass: 0.5,
  damping: 11.5,
  stiffness: 100,
  restDelta: 0.001,
  restSpeed: 0.001,
};

export const MenuItem = ({
  setActive,
  active,
  item,
  children,
}: {
  setActive: (item: string) => void;
  active: string | null;
  item: string;
  children?: React.ReactNode;
}) => {
  return (
    <div onMouseEnter={() => setActive(item)} className="relative ">
      <motion.p
        transition={{ duration: 0.3 }}
        whileHover={{
            scale: 1.1,
            transition: { duration: 0.3 },
          }}
        className="cursor-pointer text-white hover:opacity-[0.9] hover:text-blue-400" // Text color is now white
      >
        {item}
      </motion.p>
      {active !== null && (
        <motion.div
          initial={{ opacity: 0, scale: 0.85, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={transition}
        >
          {active === item && (
            <div className="absolute top-[calc(100%_+_1.2rem)] left-1/2 transform -translate-x-1/2 pt-4 ">
              <motion.div
                transition={transition}
                layoutId="active"
                className="bg-black backdrop-blur rounded-2xl overflow-hidden border border-[#2b2d2c] shadow-2xl" 
              >
                <motion.div layout className="w-max h-full p-4 ">
                  {children}
                </motion.div>
              </motion.div>
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
};

export const Menu = ({
  setActive,
  children,
}: {
  setActive: (item: string | null) => void;
  children: React.ReactNode;
}) => {
  return (
    <nav
      onMouseLeave={() => setActive(null)}
      className="relative rounded-full border border-2 backdrop-blur border-[#2b2d2c] bg-transparent shadow-input flex justify-between items-center px-8 py-6" // Transparent background and custom border
    >
      {/* Company Name - Visible only on desktop */}
      <div className="hidden md:flex items-center space-x-4">
        <Link className="text-xl font-bold text-blue-400" href={"/"}>CareerConnect</Link> {/* Replace with your company name */}
      </div>
      
      {children}
    </nav>
  );
};

export const ProductItem = ({
  title,
  description,
  href,
  src,
}: {
  title: string;
  description: string;
  href: string;
  src: string;
}) => {
  return (
    <Link href={href} className="flex space-x-2 ">
      <Image
        src={src}
        width={140}
        height={70}
        alt={title}
        className="flex-shrink-0 rounded-md shadow-2xl backdrop-blur-sm"
      />
      <div>
        <h4 className="text-xl font-bold mb-1 text-white"> {/* Text color is now white */}
          {title}
        </h4>
        <p className="text-neutral-300 text-sm max-w-[10rem]">
          {description}
        </p>
      </div>
    </Link>
  );
};

export const HoveredLink = ({ children, ...rest }: any) => {
  return (
    <motion.div 
      whileHover={{
        scale: 1.1,
        transition: { duration: 0.3 },
      }}>
      <Link
        {...rest}
        className="text-neutral-200 hover:text-blue-400" // Hover and text colors updated
      >
        {children}
      </Link>
    </motion.div>
  );
};
