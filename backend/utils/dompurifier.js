import { JSDOM } from "jsdom";
import DOMPurify from "dompurify";

const window = new JSDOM('').window;
const purify = DOMPurify(window);

export default function domPurifier(dirty){
    const clean = {}
    Object.entries(dirty).forEach(([key, value])=>{
        clean[key]= purify.sanitize(value);
    })
    return clean
}
