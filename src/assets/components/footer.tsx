import { Facebook, Twitter, Instagram, Linkedin } from "lucide-react";
import '../css/asset.css';
import '../css/index.css';

export function Footer(){
    return(
        <footer>
            <div className="footer">
                <div className="footer-left-site">
                    <ul>
                        <li>Khám phá</li>
                        <li>Hỗ trợ</li>    
                        <li>Pháp lí</li>             
                    </ul>  
                </div>
                <ul className="footer-right-site">
                    <li><Facebook/></li>
                    <li><Twitter/></li>    
                    <li><Instagram/></li>             
                    <li><Linkedin/></li>
                </ul>
            </div>
        </footer>
    )
}