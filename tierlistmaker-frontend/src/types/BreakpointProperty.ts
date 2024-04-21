import Breakpoint from "./Breakpoint";

type BreakpointProperty<T> = {
    [key in Breakpoint]: T;
};


export default BreakpointProperty;
