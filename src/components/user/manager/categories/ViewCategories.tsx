import { Button, Card } from "react-bootstrap";
import { Category } from "../../../../schemas/responses/models/Category.ts";
import { useEffect, useState } from "react";
import React from "react";
import { getCategories } from "../../../../index.js";
import { useNavigate } from "react-router-dom";

const ViewCategories = () => {
  const [categories, setCategories] = useState<Category[]>([]);

  const navigate = useNavigate();

  useEffect(() => {
    getCategories(undefined as any).then((categories) => {
      setCategories(categories);
    });
  }, []);

  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: "30px 2%", marginTop: "20px" }}>
      {categories.map((category) => (
        <Card style={{ width: "23.5%" }}>
          <Card.Img src={category.pictureUrl ?? "https://info.renome.ua/wp-content/uploads/2021/09/placeholder.png"} />
          <Card.Body>
            <Card.Title>{category.name}</Card.Title>
          </Card.Body>
          <Button onClick={() => navigate(`/product/new?categoryId=${category.categoryId}`)}>
            Add product to category
          </Button>
          <Button
            style={{ marginTop: 4 }}
            onClick={() =>
              (window.location.href = `/manager/personal?option=addCategory&parentCategoryId=${category.categoryId}`)
            }
          >
            Add child category
          </Button>
        </Card>
      ))}
    </div>
  );
};

export default ViewCategories;
