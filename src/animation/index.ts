import type { Transition, Variants } from "framer-motion";

// Configuração de animação para o Container (Pai) - Request List
export const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            // Cada filho terá um atraso de 0.1s em relação ao anterior
            staggerChildren: 0.1,
            delayChildren: 0.2, // Pequeno delay antes de começar a cascata
        },
    },
    exit: {
        opacity: 0,
        transition: { staggerChildren: 0.05, staggerDirection: -1 } // Sai em ordem inversa
    }
};

// Configuração de animação para cada Card (Filho) - Request Item
export const itemVariants: Variants = {
    hidden: {
        opacity: 0,
        y: 30,
        scale: 0.95,
        filter: "blur(4px)" // Toque extra de sofisticação
    },
    visible: {
        opacity: 1,
        y: 0,
        scale: 1,
        filter: "blur(0px)",
        transition: {
            type: "spring",
            stiffness: 100,
            damping: 15
        }
    }
};


// Curva de animação inspirada no iOS (suave e natural)
export const appleSpring: Transition = {
  type: "spring",
  stiffness: 300,
  damping: 30,
  bounce: 2
};

export const sidebarVariants = {
  expanded: { width: 220 },
  collapsed: { width: 90 },
};

export const labelVariants = {
  hidden: { opacity: 0, x: -10, filter: "blur(4px)" },
  visible: { 
    opacity: 1, 
    x: 0, 
    filter: "blur(0px)",
    transition: { ...appleSpring, delay: 0.1 } 
  },
  exit: { 
    opacity: 0, 
    x: -5, 
    filter: "blur(4px)",
    transition: { duration: 0.15 } 
  }
};


export const badgeVariants: Variants = {
  hidden: { scale: 0.8, opacity: 0 },
  visible: { 
    scale: 1, 
    opacity: 1,
    transition: { type: "spring", stiffness: 260, damping: 20 }
  }
};