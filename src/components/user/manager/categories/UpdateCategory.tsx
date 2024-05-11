import { Button, Form } from "react-bootstrap";
import React, { useState } from "react";
import { setCategoryPicture, updateCategory } from "../../../..";
import { notifyError, notifySuccess } from "../../../../utilities/notify";
import { useSearchParams } from "react-router-dom";
import { useLanguage } from "../../../../contexts/language/language-context";

const UpdateCategory = () => {
  const [params] = useSearchParams();

  const [name, setName] = useState(params.get("name"));
  const [picture, setPicture] = useState<File>();

  const { language } = useLanguage();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const category = await updateCategory(params.get("categoryId"), name);

      if (picture) {
        await setCategoryPicture(category?.categoryId, picture);
      }

      notifySuccess("Category was updated successfully");
    } catch (e) {
      notifyError("Something went wrong");
    }
  };

  return (
    <div style={{ display: "flex", justifyContent: "center", marginTop: "20px" }}>
      <Form onSubmit={handleSubmit} style={{ background: "white", borderRadius: 8, padding: 20, width: 600 }}>
        <Form.Group className="mb-3" controlId="formBasicEmail">
          <Form.Label required style={{ fontSize: 16 }}>
            {language === "EN" ? "Category name" : "Ім'я категорії"}
          </Form.Label>
          <Form.Control
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            size="lg"
            type="text"
            placeholder={language === "EN" ? "Enter category name" : "Введіть ім'я категорії"}
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="formBasicEmail">
          <Form.Label style={{ fontSize: 16 }}>{language === "EN" ? "Category picture" : "Фото"}</Form.Label>
          <Form.Control onChange={(e: any) => setPicture(e.target.files[0])} size="lg" type="file" />
        </Form.Group>
        <Button size="lg" type="submit">
          {language === "EN" ? "Update Category" : "Оновити категорію"}
        </Button>
      </Form>
    </div>
  );
};

export default UpdateCategory;
