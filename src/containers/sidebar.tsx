import { useState } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import {
    Home01Icon,
    ChatAdd01Icon,
    CustomerService01Icon,
} from "@hugeicons/core-free-icons";
import { AnimatePresence, motion } from "framer-motion";
import { appleSpring, labelVariants, sidebarVariants } from "@/animation";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "react-oidc-context";

export default function Sidebar({ isOpen }: { isOpen: boolean; }) {
    const auth = useAuth();

    const pathname = useLocation().pathname;
    const [isHovered, setIsHovered] = useState(false);

    // A sidebar está "visivelmente aberta" se estiver trancada (isOpen) ou se o cursor estiver por cima
    const isExpanded = isOpen || isHovered;

    // const publicItems = [
    // { label: "Home", icon: Home01Icon, href: "/" },
    // ];

    const protectedItems = [
        { label: "New Request", icon: ChatAdd01Icon, href: "/requests/new" },
    ];

    // O menu final depende da existência do user
    const menuItems = auth ? protectedItems : [];

    return (
        <motion.div
            initial={false}
            animate={isExpanded ? "expanded" : "collapsed"}
            variants={sidebarVariants}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className="h-full py-5 flex flex-col items-stretch bg-slate-100 border-0 border-zinc-100 overflow-hidden relative"
            transition={appleSpring}
        >
            <Link
                to="/"
                className={`flex items-center gap-4 px-5 py-3 mb-2 mx-3 rounded-xl transition-colors duration-200 group text-zinc-950`}
            >
                <HugeiconsIcon icon={CustomerService01Icon} size={24} strokeWidth={1.5} className="text-zinc-600 shrink-0" />
            </Link>

            {/* Menu Items */}
            <nav className="flex-1 flex flex-col gap-1 custom-scrollbar">
                <Link
                    to="/"
                    className={`
                                flex items-center gap-4 px-5 py-3 mx-3 rounded-xl transition-all duration-200 group
                                ${pathname === "/" ? "bg-transparent text-primary" : "text-zinc-500 hover:text-primary/90"}
                                ${!isExpanded ? "px-0 mx-2" : ""}
                            `}
                >
                    <motion.div
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        className="flex items-center justify-center shrink-0"
                    >
                        <HugeiconsIcon
                            icon={Home01Icon}
                            size={24}
                            strokeWidth={1.4}
                            className={pathname === "/" ? "text-primary" : "text-zinc-600 group-hover:text-primary/90"}
                        />
                    </motion.div>
                    <AnimatePresence>
                        {isExpanded && (
                            <motion.span
                                variants={labelVariants}
                                initial="hidden"
                                animate="visible"
                                exit="exit"
                                className={`text-base font-normal whitespace-nowrap ${pathname === "/" ? "opacity-100" : "opacity-80"}`}
                            >
                                Home
                            </motion.span>
                        )}
                    </AnimatePresence>
                </Link>
                {menuItems.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.label}
                            to={item.href}
                            className={`
                                flex items-center gap-4 px-5 py-3 mx-3 rounded-xl transition-all duration-200 group
                                ${isActive ? "bg-transparent text-primary" : "text-zinc-500 hover:text-primary/90"}
                                ${!isExpanded ? "px-0 mx-2" : ""}
                            `}
                        >
                            <motion.div
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.95 }}
                                className="flex items-center justify-center shrink-0"
                            >
                                <HugeiconsIcon
                                    icon={item.icon}
                                    size={24}
                                    strokeWidth={1.4}
                                    className={isActive ? "text-primary" : "text-zinc-600 group-hover:text-primary/90"}
                                />
                            </motion.div>
                            <AnimatePresence>
                                {isExpanded && (
                                    <motion.span
                                        variants={labelVariants}
                                        initial="hidden"
                                        animate="visible"
                                        exit="exit"
                                        className={`text-base font-normal whitespace-nowrap ${isActive ? "opacity-100" : "opacity-80"}`}
                                    >
                                        {item.label}
                                    </motion.span>
                                )}
                            </AnimatePresence>
                        </Link>
                    );
                })}
            </nav>
        </motion.div>
    );
}