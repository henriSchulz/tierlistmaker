import {motion} from 'framer-motion';
import React from "react";
import {cn} from "@/lib/utils";

type DefaultButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement>;

type Variant = 'primary' | 'secondary' | "text" | "tertiary" | "disabled" | "base" | "icon";

type ButtonProps = DefaultButtonProps & {
    children: React.ReactNode | string;
    variant?: Variant

}


const Button = (props: ButtonProps) => {

    const {children, variant, className, ...rest} = props;

    const variants: Record<Variant, string> = {
        base: "block cursor-pointer text-center font-bold disabled:cursor-not-allowed disabled:opacity-70 flex justify-center items-center text-base py-3 px-6 leading-none h-9 md:h-10 rounded-xl leading-none",
        primary: "text-white bg-gray-800",
        secondary: "border-blue-500 text-blue-500 border-2",
        tertiary: "hover:bg-gray-100 bg-gray-100 text-gray-700",
        text: "text-gray-800",
        disabled: "hover:bg-gray-100 bg-white text-gray-400",
        icon: "block cursor-pointer text-center font-bold disabled:cursor-not-allowed disabled:opacity-70 flex justify-center p-0  items-center text-gray-800 text-base leading-none h-9 md:h-10 rounded-xl leading-none"
    }


    const classNames = cn(variants.base, variant && variants[variant], className);

    // @ts-ignore
    return <motion.button {...rest}
                          whileHover={!props.disabled ? {scale: 0.97} : {}}
                          whileTap={!props.disabled ? {scale: 0.93} : {}}
                          className={classNames}
    >
        {children}
    </motion.button>


}

Button.displayName = 'Button';

export default Button;