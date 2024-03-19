import {useEffect, useState} from 'react';
import {getCookie, getDefaultHeaders, setCookie} from '../index.js'
import Operator from '../components/user/Operator'
import Customer from "./user/Customer";

const UI = () => {
    const[userInfo, setUserInfo] = useState({});

    useEffect(() => {
        if (getCookie('userInfo') === null && getCookie('token')) {
            fetchUserInfo().then(() => {});
        } else if (getCookie('userInfo')) {
            setUserInfo(JSON.parse(getCookie('userInfo')))
        } else {
            console.log('Unsigned view logic')
        }
    }, []);

    const fetchUserInfo = async () => {
        let apiUrl = process.env.REACT_APP_USER_SERVICE_ADDRESS;

        const requestOptions = {
            method: 'GET',
            headers: getDefaultHeaders()
        };
        await fetch(`${apiUrl}/api/v1/users`, requestOptions)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }

                return response.json();
            })
            .then(data => {
                if (data) {
                    setCookie('userInfo', JSON.stringify(data))
                    setUserInfo(data)
                }
            })
            .catch(error => {
                console.error('Error:', error);
            });
    };

    const component = () => {
        if (userInfo !== undefined && userInfo != null) {
            switch (userInfo.role) {
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