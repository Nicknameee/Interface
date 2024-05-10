import { Button, Card } from "react-bootstrap";
import { Category } from "../../../../schemas/responses/models/Category.ts";
import { useEffect, useState } from "react";
import React from "react";
import { getCategories } from "../../../../index.js";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "../../../../contexts/language/language-context.jsx";

const ViewCategories = () => {
  const [categories, setCategories] = useState<Category[]>([]);

  const navigate = useNavigate();

  const {language} = useLanguage();

  useEffect(() => {
    getCategories(undefined as any).then((categories) => {
      setCategories(categories);
    });
  }, []);

  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: "30px 2%", marginTop: "20px", marginBottom: '13vh' }}>
      {categories.map((category) => (
        <Card style={{ width: "23.5%" }}>
          <Card.Img src={category.pictureUrl ?? "https://info.renome.ua/wp-content/uploads/2021/09/placeholder.png"} />
          <Card.Body>
            <Card.Title>{category.name}</Card.Title>
          </Card.Body>
          <Button onClick={() => window.location.href = `/manager/personal?option=viewProduct&categoryId=${category.categoryId}`}>
            {
              language === 'EN' ? 'View categories products' : 'Список продуктів категорії'
            }
          </Button>
          <Button
              style={{ marginTop: 4 }}
              onClick={() => navigate(`/product/new?categoryId=${category.categoryId}`)}>
            {
              language === 'EN' ? 'Add product to category' : 'Новий продукт у категорію'
            }
          </Button>
          <Button
            style={{ marginTop: 4 }}
            onClick={() =>
              (window.location.href = `/manager/personal?option=addCategory&parentCategoryId=${category.categoryId}`)
            }
          >
            {
              language === 'EN' ? 'Add child category' : 'Нова субкатегорія'
            }
          </Button>
        </Card>
      ))}
    </div>
  );
};

export default ViewCategories;
