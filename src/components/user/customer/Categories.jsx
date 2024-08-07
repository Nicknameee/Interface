import React, { useRef } from "react";
import defaultImage from "../../../resources/imageNotFoundResource.png";
import { redirectToCategory } from "../../../utilities/redirect";
import { Category } from "../../../schemas/responses/models/Category.ts";
import { getQueryParam } from "../../../index";
import { useLocation } from "react-router-dom";
import { Button } from "react-bootstrap";
import {useLanguage} from "../../../contexts/language/language-context";

const Categories = ({ categories, isSubCategoryOpened, categoriesPage, setCategoriesPage, productPresent }) => {
  const location = useLocation();
  const box = useRef(null);
  const { language, setLanguage } = useLanguage();

  const handleScroll = (direction) => {
    if (box.current) {
      const scrollAmount = 300;
      const container = box.current;
      let scrollPos = container.scrollLeft;
      if (direction === "left") {
        scrollPos -= scrollAmount;
      } else if (direction === "right") {
        scrollPos += scrollAmount;
      }
      container.scrollTo({
        left: scrollPos,
        behavior: "smooth",
      });
    }
  };

  const renderCategories = (categories: Category[]) => {
    return categories.map((category) => (
      <div key={category.categoryId} about={category.name} className="mb-3 mx-1" style={{ width: 240, height: 300 }}>
        <div className="card h-100">
          {category.pictureUrl ? (
            <img
              src={category.pictureUrl}
              className="card-img-top"
              alt={category.name}
              style={{ minHeight: "50%", maxHeight: "50%" }}
            />
          ) : (
            <img src={defaultImage} className="card-img-top" alt={category.name} style={{ maxHeight: "50%" }} />
          )}
          <div className="card-body" style={{ maxHeight: "50%" }}>
            <h5 className="card-title">{category.name}</h5>
            {category.enabled ? (
              <button className="btn btn-success" onClick={() => redirectToCategory(category.categoryId)}>
                  {
                      language === 'EN' ? 'Check It Up' : 'Переглянути'
                  }
              </button>
            ) : (
              <button className="btn btn-dark" disabled={true}>
                  {
                      language === 'EN' ? 'Not Available' : 'Недоступний'
                  }
              </button>
            )}
          </div>
        </div>
      </div>
    ));
  };

  const list = (categories: Category[]) => {
    const categoryIdParam = getQueryParam("categoryId", location);

    if (categories.length > 0) {
      if (!categoryIdParam) {
        return renderCategories(categories);
      } else {
        return (
          <div className="position-relative w-100 d-flex justify-content-center">
            <div
              style={{
                width: "95%",
                display: "flex",
                overflowX: "auto",
                WebkitOverflowScrolling: "touch",
                alignItems: "center",
                justifyContent: "left",
                marginTop: "3em",
              }}
              ref={box}
            >
              {renderCategories(categories)}
            </div>
            <div
              className="button-container w-100 d-flex justify-content-between"
              style={{
                position: "absolute",
                top: "50%",
                left: "0",
                right: "0",
                transform: "translateY(-50%)",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <button className="scroll-button left" onClick={() => handleScroll("left")}>
                L
              </button>
              <button className="scroll-button right" onClick={() => handleScroll("right")}>
                R
              </button>
            </div>
          </div>
        );
      }
    } else {
      return null;
    }
  };

  return (
    <div className="w-100 py-0">
      <div className="row justify-content-center w-100 py-0">
        {list(categories)}
        {categories.length < 1 && (
          <h4 className="w-100 text-center">
              {
                  language === 'EN' ? 'No categories were found...' : 'Не знайдено категорій...'
              }
          </h4>
        )}
        { categoriesPage > 1 || (categories && categories.length > 0) ?
          <div className="w-100 d-flex justify-content-center">
            <Button
              className="mx-3"
              style={{ width: "100px" }}
              disabled={categoriesPage <= 1}
              onClick={() => {
                if (categoriesPage > 1) {
                  setCategoriesPage(categoriesPage - 1);
                }
              }}
            >
              Prev
            </Button>
            <h3 className="font-monospace">{categoriesPage}</h3>
            <Button
              className="mx-3"
              style={{ width: "100px" }}
              onClick={() => {
                if (categories.length > 0) {
                  setCategoriesPage(categoriesPage + 1);
                }
              }}
            >
              Next
            </Button>
          </div>
            :
            null
        }
      </div>
    </div>
  );
};

export default Categories;
