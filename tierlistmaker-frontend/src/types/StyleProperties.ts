import {CSSProperties} from "react";

import BreakpointProperty from "./BreakpointProperty";


export interface CustomCSSProperties {


    m?: number | BreakpointProperty<number>
    mt?: number | BreakpointProperty<number>
    mr?: number | BreakpointProperty<number>
    mb?: number | BreakpointProperty<number>
    ml?: number | BreakpointProperty<number>
    mx?: number | BreakpointProperty<number>
    my?: number | BreakpointProperty<number>


    p?: number | BreakpointProperty<number>
    pt?: number | BreakpointProperty<number>
    pr?: number | BreakpointProperty<number>
    pb?: number | BreakpointProperty<number>
    pl?: number | BreakpointProperty<number>
    px?: number | BreakpointProperty<number>
    py?: number | BreakpointProperty<number>

    bg?: string
    size?: [x: number | BreakpointProperty<number>, y: number | BreakpointProperty<number>] | number | BreakpointProperty<number>

    gridCenter?: boolean
    gridLeft?: boolean
    gridRight?: boolean


    flexCenter?: boolean
    flexLeft?: boolean
    flexRight?: boolean
    flexSpaceBetween?: boolean


    spacing?: number | BreakpointProperty<number>
    br?: number | BreakpointProperty<number> //border radius
    c?: string //color
    fs?: number | BreakpointProperty<number> //font size

}

type StyleProperties = CSSProperties & CustomCSSProperties;

export default StyleProperties;