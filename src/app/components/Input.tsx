'use client'
import React, { ChangeEvent } from 'react'

interface CustomInputProps {
    type?: string;
    placeholder?: string;
    value: string | number;
    onChange: (e: ChangeEvent<HTMLInputElement>) => void;
    additionalClasses?: string;
    [key: string]: any;
}

const CustomInput: React.FC<CustomInputProps> = ({
    type = "text",
    placeholder = "",
    value,
    onChange,
    additionalClasses = "",
    ...props
}) => {
    return (
        <input
            type={type}
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            className={`px-4 py-2 border border-gray-700 rounded focus:outline-none  focus:border-blue-600 ${additionalClasses}`}
            {...props}
        />
    );
};

export default CustomInput;