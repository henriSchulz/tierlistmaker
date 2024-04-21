import StyleProperties from "../types/StyleProperties";
import {CSSProperties} from "react";
import Breakpoint from "../types/Breakpoint";
import BreakpointProperty from "../types/BreakpointProperty";
import ValueOf from "../types/ValueOf";


export default class StyleController {

    public static BREAKPOINTS: BreakpointProperty<number> = {
        xs: 0,
        sm: 600,
        md: 900,
        lg: 1200,
        xl: 1536,
    }

    private static CUSTOM_PROPERTIES = {
        margin: {
            m: {key: "margin", val: "{val}px"},
            mt: {key: "marginTop", val: "{val}px"},
            mr: {key: "marginRight", val: "{val}px"},
            mb: {key: "marginBottom", val: "{val}px"},
            ml: {key: "marginLeft", val: "{val}px"},
            my: {key: "margin", val: "{val}px auto"},
            mx: {key: "margin", val: "auto {val}px"},


        },
        padding: {
            p: {key: "padding", val: "{val}px"},
            pt: {key: "paddingTop", val: "{val}px"},
            pr: {key: "paddingRight", val: "{val}px"},
            pb: {key: "paddingBottom", val: "{val}px"},
            pl: {key: "paddingLeft", val: "{val}px"},
            py: {key: "padding", val: "{val}px auto"},
            px: {key: "padding", val: "auto {val}px"},
        },


    }

    public static PX_MULTIPLIER: number = 8;


    public static convertStyleProperties(styleProperties: StyleProperties): CSSProperties {

        const cssProperties: CSSProperties = {...styleProperties};

        let marginKey: keyof typeof this.CUSTOM_PROPERTIES.margin

        for (marginKey in this.CUSTOM_PROPERTIES.margin) {
            const marginElement = this.CUSTOM_PROPERTIES.margin[marginKey];

            if (styleProperties[marginKey as keyof StyleProperties]) {
                const val = styleProperties[marginKey as keyof StyleProperties] as number | undefined | BreakpointProperty<number>

                if (!val) continue;

                if (typeof val === "number") {
                    const pxValue = val * this.PX_MULTIPLIER;
                    const cssKey = marginElement.key as keyof CSSProperties;

                    // @ts-ignore
                    cssProperties[cssKey] = marginElement.val.replace("{val}", pxValue.toString());
                } else {
                    const pxValue = this.chooseBreakpointValue(val) * this.PX_MULTIPLIER;
                    const cssKey = marginElement.key as keyof CSSProperties;
                    // @ts-ignore
                    cssProperties[cssKey] = marginElement.val.replace("{val}", pxValue.toString());
                }
            }
        }

        let paddingKey: keyof typeof this.CUSTOM_PROPERTIES.padding

        for (paddingKey in this.CUSTOM_PROPERTIES.padding) {
            const paddingElement = this.CUSTOM_PROPERTIES.padding[paddingKey];

            if (styleProperties[paddingKey as keyof StyleProperties]) {
                const val = styleProperties[paddingKey as keyof StyleProperties] as number | undefined | BreakpointProperty<number>

                if (!val) continue;

                if (typeof val === "number") {
                    const pxValue = val * this.PX_MULTIPLIER;
                    const cssKey = paddingElement.key as keyof CSSProperties;
                    // @ts-ignore
                    cssProperties[cssKey] = paddingElement.val.replace("{val}", pxValue.toString());
                } else {
                    const pxValue = this.chooseBreakpointValue(val) * this.PX_MULTIPLIER;
                    const cssKey = paddingElement.key as keyof CSSProperties;
                    // @ts-ignore
                    cssProperties[cssKey] = paddingElement.val.replace("{val}", pxValue.toString());
                }
            }
        }

        if (styleProperties.bg) {
            cssProperties.background = styleProperties.bg;
        }

        if (styleProperties.size) {
            if (Array.isArray(styleProperties.size)) {
                if (typeof styleProperties.size[0] === "number") {
                    cssProperties.width = styleProperties.size[0] + "px";
                } else {
                    cssProperties.width = this.chooseBreakpointValue(styleProperties.size[0]) + "px";
                }

                if (typeof styleProperties.size[1] === "number") {
                    cssProperties.height = styleProperties.size[1] + "px";
                } else {
                    cssProperties.height = this.chooseBreakpointValue(styleProperties.size[1]) + "px";
                }

            } else {
                if (typeof styleProperties.size === "number") {
                    const pxValue = styleProperties.size;
                    cssProperties.width = pxValue + "px";
                    cssProperties.height = pxValue + "px";
                } else {
                    const pxValue = this.chooseBreakpointValue(styleProperties.size);
                    cssProperties.width = pxValue + "px";
                    cssProperties.height = pxValue + "px";
                }
            }
        }

        if (styleProperties.gridCenter) {
            cssProperties.display = "grid";
            cssProperties.placeItems = "center";
            cssProperties.alignItems = "center";
        }

        if (styleProperties.gridLeft) {
            cssProperties.display = "grid";
            cssProperties.placeItems = "start";
            cssProperties.alignItems = "center";
        }

        if (styleProperties.gridRight) {
            cssProperties.display = "grid";
            cssProperties.placeItems = "end";
            cssProperties.alignItems = "center";
        }


        if (styleProperties.flexCenter) {
            cssProperties.display = "flex";
            cssProperties.justifyContent = "center";
            cssProperties.alignItems = "center";
        }

        if (styleProperties.flexLeft) {
            cssProperties.display = "flex";
            cssProperties.justifyContent = "flex-start";
            cssProperties.alignItems = "center";
        }

        if (styleProperties.flexRight) {
            cssProperties.display = "flex";
            cssProperties.justifyContent = "flex-end";
            cssProperties.alignItems = "center";
        }

        if (styleProperties.flexSpaceBetween) {
            cssProperties.display = "flex";
            cssProperties.justifyContent = "space-between";
            cssProperties.alignItems = "center";
        }

        if (styleProperties.spacing) {
            if (typeof styleProperties.spacing === "number") {
                cssProperties.gap = styleProperties.spacing * this.PX_MULTIPLIER + "px";
            } else {
                cssProperties.gap = this.chooseBreakpointValue(styleProperties.spacing) * this.PX_MULTIPLIER + "px";
            }
        }

        if (styleProperties.br) {
            if (typeof styleProperties.br === "number") {
                cssProperties.borderRadius = styleProperties.br * this.PX_MULTIPLIER + "px";
            } else {
                cssProperties.borderRadius = this.chooseBreakpointValue(styleProperties.br) * this.PX_MULTIPLIER + "px";
            }
        }

        if (styleProperties.c) {
            cssProperties.color = styleProperties.c;
        }

        if (styleProperties.fs) {
            if (typeof styleProperties.fs === "number") {
                cssProperties.fontSize = styleProperties.fs * this.PX_MULTIPLIER + "px";
            } else {
                cssProperties.fontSize = this.chooseBreakpointValue(styleProperties.fs) * this.PX_MULTIPLIER + "px";
            }
        }

        return cssProperties;
    }


    public static getWindowWidth(): Breakpoint {
        if (window.innerWidth < this.BREAKPOINTS.sm) {
            return "xs"
        }

        if (window.innerWidth < this.BREAKPOINTS.md) {
            return "sm"
        }

        if (window.innerWidth < this.BREAKPOINTS.lg) {
            return "md"
        }

        if (window.innerWidth < this.BREAKPOINTS.xl) {
            return "lg"
        }

        return "xl"
    }

    private static chooseBreakpointValue<T>(breakDownProperty: BreakpointProperty<T>): ValueOf<BreakpointProperty<T>> {
        return breakDownProperty[this.getWindowWidth()];
    }


}