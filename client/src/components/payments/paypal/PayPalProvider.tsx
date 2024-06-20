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
        clientId: 'ARBsVjEVgTdbX2JdEe7rCiQgYCyPMJvf1lO68noU45dtbtPNgUHsy05soQitpUNgnVZTtarneZswHq1F'

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