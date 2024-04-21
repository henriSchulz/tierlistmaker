import React from "react";
import StyleComponentProps from "@/types/StyleComponentProps";
import StyleController from "@/styles/StyleController";


type BoxProps = StyleComponentProps & {
    children?: React.ReactNode | string;
    as?: React.ElementType;
} & React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>;


const Box = React.forwardRef<HTMLElement, BoxProps>((props, ref) => {

    const Component = props.as || "div"

    const styles = StyleController.convertStyleProperties({...props, ...props.sx})

    return (
        <Component style={styles} ref={ref} {...props} />
    )
})

Box.displayName = "Box"

export {Box}