import { Button, Card, ListGroup, ListGroupItem, Form } from "react-bootstrap";
import { Category } from "../../../../schemas/responses/models/Category.ts";
import { useEffect, useState } from "react";
import React from "react";
import { getCategories, changeCategoryState } from "../../../../index.js";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "../../../../contexts/language/language-context.jsx";
import { CategoryFilter } from "../../../../schemas/requests/filters/CategoryFilter.ts";

const ViewCategories = () => {
  const [categories, setCategories] = useState<Category[]>([]);

  const navigate = useNavigate();

  const { language } = useLanguage();

  const [categoryId, setCategoryId] = useState("");
  const [isBlocked, setIsBlocked] = useState("ALL");

  useEffect(() => {
    getCategories(undefined as any).then((categories) => {
      setCategories(categories);
    });
  }, []);

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", paddingTop: 20 }}>
      <ListGroup style={{ width: "600px" }}>
        <ListGroupItem className="d-flex justify-content-between align-items-center">
          <div style={{ whiteSpace: "nowrap", marginRight: 5 }}>
            {language === "EN" ? "Category ID:" : "ІД категорії:"}
          </div>
          <input
            type="text"
            name="issuedAtFrom"
            className="form-control"
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
          />
        </ListGroupItem>
        <ListGroupItem className="d-flex justify-content-between align-items-center">
          <div style={{ whiteSpace: "nowrap", marginRight: 5 }}>{language === "EN" ? "Status:" : "Статус:"}</div>
          <Form.Select value={isBlocked} onChange={(e) => setIsBlocked(e.target.value)} size="lg">
            <option value="ALL">{language === "EN" ? "All" : "Всі"}</option>
            <option value="BLOCKED">{language === "EN" ? "Blocked" : "Заблоковано"}</option>
            <option value="UNBLOCKED">{language === "EN" ? "Unblocked" : "Розблоковано"}</option>
          </Form.Select>
        </ListGroupItem>
        <ListGroupItem className="d-flex justify-content-between">
          <Button
            color="primary"
            onClick={() => {
              getCategories(
                CategoryFilter.build({
                  enabled: isBlocked === "ALL" ? null : isBlocked === "BLOCKED" ? false : true,
                  categoryId,
                })
              ).then((categories) => {
                setCategories(categories);
              });
            }}
          >
            {language === "EN" ? "Filter" : "Фільтр"}
          </Button>
          <Button
            color="primary"
            onClick={() => {
              setCategoryId("");
              setIsBlocked("ALL");
              getCategories(undefined as any).then((categories) => {
                setCategories(categories);
              });
            }}
          >
            {language === "EN" ? "Drop Filters" : "Скинути фільтрацію"}
          </Button>
        </ListGroupItem>
      </ListGroup>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "30px 2%", marginTop: "20px", marginBottom: "13vh" }}>
        {categories?.map((category) => (
          <Card style={{ width: "23.5%" }}>
            <Card.Img
              src={category.pictureUrl ?? "https://info.renome.ua/wp-content/uploads/2021/09/placeholder.png"}
            />
            <Card.Body>
              <Card.Title>{category.name}</Card.Title>
            </Card.Body>
            <Button
              style={{ marginTop: 4 }}
              onClick={() =>
                (window.location.href = `/manager/personal?option=updateCategory&categoryId=${category.categoryId}&name=${category.name}`)
              }
            >
              {language === "EN" ? "Update category" : "Оновити категорію"}
            </Button>
            {category.enabled ? (
              <Button
                style={{ marginTop: 4 }}
                onClick={async () => {
                  await changeCategoryState(category.categoryId, false);
                  category.enabled = false;
                  setCategories([...categories]);
                }}
              >
                {language === "EN" ? "Block category" : "Заблокувати категорію"}
              </Button>
            ) : (
              <Button
                style={{ marginTop: 4 }}
                onClick={async () => {
                  await changeCategoryState(category.categoryId, true);
                  category.enabled = true;
                  setCategories([...categories]);
                }}
              >
                {language === "EN" ? "Unblock category" : "Розблокувати категорію"}
              </Button>
            )}
            <Button
              style={{ marginTop: 4 }}
              onClick={() =>
                (window.location.href = `/manager/personal?option=viewProduct&categoryId=${category.categoryId}`)
              }
            >
              {language === "EN" ? "View categories products" : "Список продуктів категорії"}
            </Button>
            <Button style={{ marginTop: 4 }} onClick={() => navigate(`/product/new?categoryId=${category.categoryId}`)}>
              {language === "EN" ? "Add product to category" : "Новий продукт у категорію"}
            </Button>
            <Button
              style={{ marginTop: 4 }}
              onClick={() =>
                (window.location.href = `/manager/personal?option=addCategory&parentCategoryId=${category.categoryId}`)
              }
            >
              {language === "EN" ? "Add child category" : "Нова субкатегорія"}
            </Button>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ViewCategories;
