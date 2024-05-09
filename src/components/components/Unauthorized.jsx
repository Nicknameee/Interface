import React from 'react';
import {redirectToSignIn, redirectToUI} from "../../utilities/redirect";
import {useLanguage} from "../../contexts/language/language-context";
import Footer from "./Footer";
import Header from "./Header";

const Unauthorized = () => {
    const { language, setLanguage } = useLanguage();

    return (
        <div className="tone w-100 h-100">
            <Header />
            <div className="d-flex flex-column w-100 justify-content-center text-center font-monospace align-items-center" style={{fontSize: '1.5em', height: '84vh'}}>
                <h2>401 Unauthorized</h2>
                <p>
                    {
                        language === 'EN' ? 'Sorry, the page you are looking for does not available for you.' : 'Вибачте, сторінка на яку ви переходите не доступна вам'
                    }
                </p>
                <a className="text-white link-with-borders my-1" style={{cursor: 'pointer'}} onClick={redirectToSignIn}>
                    {
                        language === 'EN' ? 'Sign In' : 'Авторизація'
                    }
                </a>
                <a className="text-white link-with-borders" style={{cursor: 'pointer'}}  onClick={redirectToUI}>
                    {
                        language === 'EN' ? 'Go to Homepage' : 'Головна сторінка системи'
                    }
                </a>
            </div>
            <Footer />
        </div>
    );
}

export default Unauthorized;