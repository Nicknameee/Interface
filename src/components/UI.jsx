import {useEffect, useState} from 'react';
import {getCookie} from '../index.js'
import Operator from '../components/user/Operator'
import CustomerDashboard from "./user/customer/CustomerDashboard";

const UI = () => {
    const[userInfo, setUserInfo] = useState({});

    useEffect(() => {
        if (getCookie('userInfo')) {
            setUserInfo(JSON.parse(getCookie('userInfo')))
        } else {
            console.log('Unsigned view logic')
        }
    }, []);

    const component = () => {
        if (userInfo !== undefined && userInfo != null) {
            switch (userInfo.role) {
                case 'ROLE_MANAGER':
                    return <CustomerDashboard/>;
                case 'ROLE_SUPPORT':
                    return null;
                case 'ROLE_VENDOR':
                    return null;
                case 'ROLE_OPERATOR':
                    return <Operator/>
                case 'ROLE_CUSTOMER':
                    return <CustomerDashboard/>
                default:
                    return <CustomerDashboard/>
            }
        } else {
            return <CustomerDashboard/>
        }
    };

    return (
        <div className="page">
        {
            component()
        }
        </div>
    );
}

export default UI;