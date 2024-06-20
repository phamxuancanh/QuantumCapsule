import React, { useState } from 'react';
import './Checkout.scss';
import { PayPalButtons, ScriptReducerAction, usePayPalScriptReducer } from "@paypal/react-paypal-js";
import { CreateOrderActions, CreateOrderData } from '@paypal/paypal-js';

const supportedCurrencies = ["USD"];

export interface ICheckoutProps {
    voucherId: string;
    totalAmount: number;
    handleSuccess: () => void
    handleFail: () => void
}

const Checkout = (props: ICheckoutProps) => {
    const [{ options, isPending }, dispatch] = usePayPalScriptReducer();
    const [currency, setCurrency] = useState(options.currency || "USD");
    const [key, setKey] = useState(0);
    React.useEffect(() => {
        setKey(prevKey => prevKey + 1);
    }, [props.totalAmount, currency])

    const onCurrencyChange = ({ target: { value } }: React.ChangeEvent<HTMLSelectElement>) => {
        setCurrency(value);
        dispatch({
            type: "resetOptions",
            value: {
                ...options,
                currency: value,
            },
        } as ScriptReducerAction);
    }

    const onCreateOrder = (data: CreateOrderData, actions: CreateOrderActions) => {
        
        return actions.order.create({
            purchase_units: [
                {
                    amount: {
                        currency_code: currency,
                        value: props.totalAmount.toFixed(2),
                    },
                    custom_id: Date.now().toString(),
                    description: 'Voucher Purchase',
                },
            ],
            intent: 'CAPTURE'
        });
    }

    const onApproveOrder = (data: any, actions: any) => {
        return actions.order.capture().then((details: { payer: { name: { given_name: any; }; }; }) => {
            const name = details.payer.name.given_name;
            console.log(`Transaction completed by ${name}`);
            console.log(actions);
            console.log(props);
            
            props.handleSuccess();  
        }).catch((error: any) => {
            console.error("Capture error:", error);
            console.log(actions);
            console.log(props);
            props.handleFail();  
        });
    }

    return (
        <div className="checkout">
            {isPending ? <p>LOADING...</p> : (
                <>
                    <select value={currency} onChange={onCurrencyChange}>
                        {supportedCurrencies.map((currency) => (
                            <option key={currency} value={currency}>{currency}</option>
                        ))}
                    </select>
                    <PayPalButtons
                        key={key}
                        style={{ layout: "vertical" }}
                        createOrder={onCreateOrder}
                        onApprove={onApproveOrder}
                    />
                </>
            )}
        </div>
    );
}

export default Checkout;
