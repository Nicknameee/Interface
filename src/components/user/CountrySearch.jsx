import React, {useEffect, useState} from 'react';
import '../../styles/CountrySearch.css';
import {ListGroup, ListGroupItem} from "react-bootstrap";
import OutsideClickHandler from "../handlers/OutsideClickHandler";
import {setCookie} from "../../index";

const CountrySearch = ({setCountry, country}) => {
    const [isFocused, setIsFocused] = useState(false);
    const [countries, setCountries] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchCountries = async () => {
            try {
                if (countries.length < 1) {
                    let items = localStorage.getItem('countries')
                    if (items) {
                        setCountries(JSON.parse(items))
                    } else {
                        setIsLoading(true);
                        setError(null);
                        let response = await fetch('https://restcountries.com/v3.1/all');
                        if (response.ok) {
                            const data = await response.json();
                            const countryObjects = data.map(country => ({
                                name: country.name.common,
                                timezones: country.timezones
                            }));
                            setCountries(countryObjects);
                            const date = new Date();
                            date.setFullYear(date.getFullYear() + 1)
                            localStorage.setItem('countries', JSON.stringify(countryObjects));
                        } else {
                            console.error(`Failed to fetch countries: ${response.status}`);
                        }
                    }
                }
            } catch (err) {
                setError(err.message);
            } finally {
                setIsLoading(false);
            }
        };

        fetchCountries();

        if (country) {
            setSearchTerm(country)
        }
    }, []);

    const handleChange = (event) => {
        setSearchTerm(event.target.value);
        const filteredResults = countries.filter(country =>
            country.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setSearchResults(filteredResults);
    };

    const handleCountrySelect = (name) => {
        console.log(`Selected Country: ${name}`);
        setSearchTerm(name)
        setIsFocused(false);
        if (name) {
            setCountry(name)
            let exp = new Date();
            exp.setMonth(new Date().getMonth() + 1)
            setCookie('country', name, exp.getTime())
        }
    };

    return (
        <div className="country-search">
            {isLoading && <p>Loading countries...</p>}
            {error && <p className="error">Error: {error}</p>}
            <OutsideClickHandler outsideClickCallbacks={[{callback: () => setIsFocused(false), containers: [document.getElementById('searchTerm'), document.getElementById('list')]}]}>
                <input className="w-50 search-input" type="text" id="searchTerm"
                       placeholder="Search countries..."
                       value={searchTerm}
                       onClick={() => setSearchResults(countries)}
                       onChange={handleChange}
                       onFocus={() => setIsFocused(true)}/>
                <ListGroup style={{ maxHeight: '190px', overflowY: 'auto', width: '50%' }} hidden={!isFocused} id="list">
                    {searchResults.map((country) => (
                        <ListGroupItem
                            style={{cursor: 'pointer', width: '100%'}}
                            key={country.name}
                            onClick={() => handleCountrySelect(country.name)}>
                            {country.name}
                        </ListGroupItem>
                    ))}
                </ListGroup>
            </OutsideClickHandler>
        </div>
    );
};

export default CountrySearch;
