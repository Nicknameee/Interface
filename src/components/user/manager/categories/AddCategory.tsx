import { Button, Form } from "react-bootstrap";
import React, { useState } from "react";
import { createCategory, setCategoryPicture } from "../../../..";
import { notifyError, notifySuccess } from "../../../../utilities/notify";
import { useSearchParams } from "react-router-dom";

const AddCategory = () => {
  const [name, setName] = useState("");
  const [picture, setPicture] = useState<File>();

  const [params] = useSearchParams();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const category = await createCategory(name, params.get("parentCategoryId") ?? undefined);

      if (picture) {
        await setCategoryPicture(category?.categoryId, picture);
      }

      notifySuccess("Category was created successfully");
    } catch (e) {
      notifyError("Something went wrong");
    }
  };

  return (
    <div style={{ display: "flex", justifyContent: "center", marginTop: "20px" }}>
      <Form onSubmit={handleSubmit} style={{ background: "white", borderRadius: 8, padding: 20, width: 600 }}>
        <Form.Group className="mb-3" controlId="formBasicEmail">
          <Form.Label required style={{ fontSize: 16 }}>
            Category name
          </Form.Label>
          <Form.Control
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            size="lg"
            type="text"
            placeholder="Enter category name"
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="formBasicEmail">
          <Form.Label style={{ fontSize: 16 }}>Category picture</Form.Label>
          <Form.Control onChange={(e: any) => setPicture(e.target.files[0])} size="lg" type="file" />
        </Form.Group>
        <Button size="lg" type="submit">
          Create Category
        </Button>
      </Form>
    </div>
  );
};

export default AddCategory;
