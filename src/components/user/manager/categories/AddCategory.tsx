import {Button, Form} from "react-bootstrap";
import React, {useState} from "react";
import {createCategory, setCategoryPicture} from "../../../..";
import {notifyError, notifySuccess} from "../../../../utilities/notify";
import {useSearchParams} from "react-router-dom";
import { useLanguage } from "../../../../contexts/language/language-context";
import { redirectToViewCategory } from "../../../../utilities/redirect";

const AddCategory = () => {
  const [name, setName] = useState("");
  const [picture, setPicture] = useState<File>();

  const [params] = useSearchParams();


  const {language} = useLanguage();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const category = await createCategory(name, params.get("parentCategoryId") ?? undefined);

      if (picture) {
        await setCategoryPicture(category?.categoryId, picture);
      }

      if (language === 'EN') {
        notifySuccess("Category was created successfully");
      } else {
        notifySuccess('Успішно створено категорію')
      }
      setTimeout(() => window.location.reload(), 1500);
    } catch (e) {
      if (language === 'EN') {
        notifyError("Something went wrong");
      } else {
        notifyError("Щось пішло не так!")
      }
    }
  };

  return (
    <div style={{ display: "flex", flexWrap: 'wrap', justifyContent: "center", marginTop: "20px" }}>
      <Form onSubmit={handleSubmit} style={{ background: "white", borderRadius: 8, padding: 20, width: 600 }}>
        <Form.Group className="mb-3" controlId="formBasicEmail">
          <Form.Label required style={{ fontSize: 16 }}>
            {
              language === 'EN' ? 'Category name' : 'Ім\'я категорії'
            }
          </Form.Label>
          <Form.Control
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            size="lg"
            type="text"
            placeholder={ language === 'EN' ? "Enter category name" : 'Введіть ім\'я категорії'}
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="formBasicEmail">
          <Form.Label style={{ fontSize: 16 }}>
            {
              language === 'EN' ? 'Category picture' : 'Фото'
            }
          </Form.Label>
          <Form.Control onChange={(e: any) => setPicture(e.target.files[0])} size="lg" type="file" />
        </Form.Group>
        <Button size="lg" type="submit">
          {
            language === 'EN' ? 'Create Category' : 'Зареєструвати категорію'
          }
        </Button>
      </Form>
      <Button style={{width: '70%', marginTop: '30px'}} onClick={() => redirectToViewCategory()}>
        {language === 'EN' ? 'Go back to view categories' : 'На сторінку перегляду категорій'}
      </Button>
    </div>
  );
};

export default AddCategory;
