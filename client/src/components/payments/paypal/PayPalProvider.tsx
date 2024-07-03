import React from 'react';
import { PayPalScriptProvider, ReactPayPalScriptOptions } from '@paypal/react-paypal-js';
import CheckOut from './CheckOut';

interface IPayPalProviderProps {
    voucherId: string
    totalAmount: number
    handleSuccess: () => void
    handleFail: () => void
}

const PayPalProvider: React.FC<IPayPalProviderProps> = (props: IPayPalProviderProps) => {
    // Your component logic here
    const initialOptions: ReactPayPalScriptOptions = {
        currency: "USD",
        intent: "capture",
        clientId: process.env.REACT_APP_PAYPAL_CLIENT_ID!,

    }
    
    return (
        <>
            <PayPalScriptProvider options={initialOptions}>
                <CheckOut {...props} />
            </PayPalScriptProvider>
        </>
    );
};

export default PayPalProvider;