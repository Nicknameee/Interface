import {useEffect, useState} from 'react';
import {getCookie} from '../index.js'
import Operator from '../components/user/Operator'
import Customer from "./user/Customer";

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
                    return <Customer/>;
                case 'ROLE_SUPPORT':
                    return null;
                case 'ROLE_VENDOR':
                    return null;
                case 'ROLE_OPERATOR':
                    return <Operator/>
                case 'ROLE_CUSTOMER':
                    return <Customer/>
                default:
                    return <Customer/>
            }
        } else {
            return <Customer/>
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