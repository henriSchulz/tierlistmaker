import StyleProperties from "./StyleProperties";

export default interface StyleComponentProps {
    sx?: StyleProperties
    mt?: number
    mr?: number
    mb?: number
    ml?: number

    pt?: number
    pr?: number
    pb?: number
    pl?: number

    gridCenter?: boolean
    gridLeft?: boolean
    gridRight?: boolean

    flexCenter?: boolean
    flexLeft?: boolean
    flexRight?: boolean
    flexSpaceBetween?: boolean

    spacing?: number

}