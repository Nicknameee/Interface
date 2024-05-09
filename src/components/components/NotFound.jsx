import React from 'react';
import {redirectToUI} from "../../utilities/redirect";
import Footer from "./Footer";
import Header from "./Header";
import {useLanguage} from "../../contexts/language/language-context";

const NotFound = () => {
    const { language, setLanguage } = useLanguage();

    return (
        <div className="tone w-100 h-100">
            <Header />
            <div className="d-flex flex-column w-100 justify-content-center text-center font-monospace align-items-center" style={{fontSize: '1.5em', height: '84vh'}}>
                <h2>404 Not Found</h2>
                <p>
                    {
                        language === 'EN' ? 'Sorry, the page you are looking for does not exist.' : 'На жаль, ця сторінка не існує'
                    }
                </p>
                <a className="text-white link-with-borders" style={{cursor: 'pointer'}}  onClick={redirectToUI}>
                    {
                        language === 'EN' ? 'Go to Homepage' : 'На домашню сторінку'
                    }
                </a>
            </div>
            <Footer />
        </div>
    );
}

export default NotFound;