import { ReactNode, useEffect } from "react";
import './style.css';

interface CustomButtonProps {
    children: ReactNode;
    varient: 'primary' | 'secondary';
    type: 'button' | 'submit' | 'reset';
    onClick?: () => void;
}

const CustomButton: React.FC<CustomButtonProps> = ({ children, varient, onClick, type }) => {

    return (
        <button type={type} onClick={onClick} className={`button text-lg ${varient === 'primary' ? 'primary-button' : 'secondary-button'}`}>{children}</button>
    )
}

export default CustomButton;