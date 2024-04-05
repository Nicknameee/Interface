import React, {useRef} from 'react';
import defaultImage from '../../../resources/imageNotFoundResource.png';
import {redirectToCategory} from "../../../utilities/redirect";
import {Category} from "../../../schemas/Category.ts";
import {getQueryParam} from "../../../index";
import {useLocation} from "react-router-dom";

const Categories = ({categories}) => {
    const location = useLocation();
    const imagesRef = useRef(null);

    const handleScroll = (direction) => {
        if (imagesRef.current) {
            const scrollAmount = 300;
            const container = imagesRef.current;
            let scrollPos = container.scrollLeft;
            if (direction === 'left') {
                scrollPos -= scrollAmount;
            } else if (direction === 'right') {
                scrollPos += scrollAmount;
            }
            container.scrollTo({
                left: scrollPos,
                behavior: 'smooth'
            });
        }
    };

    const renderCategories = (categories: Category[]) => {
        return (
            categories.map((category) => (
                <div key={category.categoryId} about={category.name} className="mb-3"
                     style={{maxWidth: '15%', width: '15%', minWidth: '15%', marginRight: '15px', marginLeft: '15px'}}>
                    <div className="card h-100">
                        {category.pictureUrl ? (
                                <img
                                    src={category.pictureUrl}
                                    className="card-img-top"
                                    alt={category.name}
                                    style={{minHeight: '50%', maxHeight: '50%'}}
                                />
                            ) :
                            (
                                <img
                                    src={defaultImage}
                                    className="card-img-top"
                                    alt={category.name}
                                    style={{maxHeight: '50%'}}
                                />
                            )}
                        <div className="card-body" style={{maxHeight: '50%'}}>
                            <h5 className="card-title">{category.name}</h5>
                            {category.enabled ?
                                <button className="btn btn-success" onClick={() => redirectToCategory(category.categoryId)}>Check It Up</button>
                                :
                                <button className="btn btn-dark" disabled={true}>Not Available</button>
                            }
                        </div>
                    </div>
                </div>
            ))
        );
    }
    const list = (categories: Category[]) => {
        const categoryIdParam = getQueryParam('categoryId', location);

        if (categories.length > 0) {
            if (!categoryIdParam) {
                return (
                    renderCategories(categories)
                );
            } else {
                return (
                    <div className="position-relative w-100 d-flex justify-content-center">
                        <div style={{ width: '95%', display: 'flex', overflowX: 'auto', WebkitOverflowScrolling: 'touch', alignItems: 'center', justifyContent: 'space-between', marginTop: '3em' }} ref={imagesRef}>
                            {renderCategories(categories)}
                        </div>
                        <div className="button-container w-100 d-flex justify-content-between" style={{ position: 'absolute', top: '50%', left: '0', right: '0', transform: 'translateY(-50%)', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                            <button className="scroll-button left" onClick={() => handleScroll('left')}>
                                L
                            </button>
                            <button className="scroll-button right" onClick={() => handleScroll('right')}>
                                R
                            </button>
                        </div>
                    </div>
                )
            }
        } else {
            return null;
        }
    };

    return (
        <div className="w-100 py-0">
            <div className="row justify-content-center w-100 py-0">
                {list(categories)}
            </div>
        </div>
    );
};

export default Categories;
