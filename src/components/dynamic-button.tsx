import { motion } from "framer-motion";
// import { usePalette } from 'react-palette';

export default function DynamicButton({ block, icon, filled, small, ghost, disabled, children }: { icon?: boolean; block?: boolean; filled?: boolean; ghost?: boolean; small?: boolean; disabled?: boolean; children: React.ReactNode }) {

    // Extrai a paleta de cores da imagem do curso
    // const { data, loading, error } = usePalette(course?.thumbnail);

    // const triggerHaptic = () => {
    //     if (typeof window !== "undefined" && window.navigator.vibrate) {
    //         window.navigator.vibrate(8);
    //     }
    // };

    // Cor dinâmica: usa a cor vibrante da imagem, ou um azul padrão enquanto carrega
    // const dynamicColor = data.vibrant || color;

    return (
        <motion.button
            onClick={() => { }}
            // whileHover={{ scale: 1.2 }}
            // whileTap={{ scale: 0.9 }}
            // type="button"
            disabled={disabled}
            style={{
                // color: filled ? 'white' : color,
                // backgroundColor: filled ? color : 'white',
            }}
            className={`flex items-center justify-center gap-2 rounded-full cursor-pointer transition-all text-nowrap whitespace-nowrap font-medium 
                ${small ? 'h-10 px-6 text-sm' : 'h-12 px-8 text-[15px]'} 
                ${icon && 'w-10 h-10 rounded-full text-zinc-500 p-0'} 
                ${filled ? `bg-primary text-white hover:opacity-95` : 'bg-white text-primary hover:bg-neutral-100'}
                ${block && 'w-full'}
                ${!ghost && 'border border-neutral-200/80'}
                ${disabled && 'opacity-50 cursor-not-allowed pointer-events-none select-none'}
`}
        // ${color ? `${color}` : 'text-neutral-800 bg-neutral-100'} 
        // style={{ backgroundColor: `${dynamicColor}66` }} // 66 é ~40% de opacidade em hex
        >
            {children}
            {/* O fundo do botão agora é uma versão escura da cor da imagem */}
            {/* <CardDescription className="text-[15px] font-medium text-white">Follow</CardDescription> */}
        </motion.button>
    );
}
