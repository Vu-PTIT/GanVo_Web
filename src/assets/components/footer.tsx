import { Facebook, Twitter, Instagram, Linkedin } from "lucide-react";
import '../css/asset.css';
import '../css/index.css';
import { Link } from "react-router-dom";

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
                    <li><Facebook className='style-icon'/></li>
                    <li><Twitter className='style-icon'/></li>    
                    <li><Instagram className='style-icon'/></li>             
                    <li><Linkedin className='style-icon'/></li>
                </ul>
            </div>
        </footer>
    )
}