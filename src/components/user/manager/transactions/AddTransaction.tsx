import { Button, Form } from "react-bootstrap";
import { useState } from "react";
import React from "react";
import { createTransaction } from "../../../..";
import { notifySuccess, notifyError } from "../../../../utilities/notify";
import { useLanguage } from "../../../../contexts/language/language-context";

const AddTransaction = () => {
  const [number, setNumber] = useState("");
  const [paymentAmount, setPaymentAmount] = useState("");

  const { language, setLanguage } = useLanguage();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!number || !paymentAmount) return;

    try {
      await createTransaction(number, Number(paymentAmount));

      if (language === 'EN') {
        notifySuccess("Payment was created successfully");
      } else {
        notifySuccess("Ваш платіж було зареєстровано");
      }
    } catch (e) {
      if (language === 'EN') {
        notifyError("Something went wrong");
      } else {
        notifyError('Щось пішло не так')
      }
    }
  };

  return (
    <div style={{ display: "flex", justifyContent: "center", marginTop: "20px" }}>
      <Form onSubmit={handleSubmit} style={{ background: "white", borderRadius: 8, padding: 20, width: 600 }}>
        <Form.Group className="mb-3" controlId="formBasicEmail">
          <Form.Label required style={{ fontSize: 16 }}>
            {
              language === 'EN' ? 'Order number' : 'Замовлення номер'
            }
          </Form.Label>
          <Form.Control
            value={number}
            onChange={(e) => setNumber(e.target.value)}
            required
            size="lg"
            type="text"
            placeholder={ language === 'EN' ? "Enter order number" : 'Уведіть номер замовлення'}
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="formBasicEmail">
          <Form.Label required style={{ fontSize: 16 }}>
            {
              language === 'EN' ? 'Payment amount' : 'Сума'
            }
          </Form.Label>
          <Form.Control
            value={paymentAmount}
            onChange={(e) => setPaymentAmount(e.target.value)}
            required
            size="lg"
            type="number"
            placeholder={ language === 'EN' ? "Enter payment amount" : 'Уведіть суму транзакції'}
          />
        </Form.Group>
        <Button size="lg" type="submit">
          {
            language === 'EN' ? 'Add Payment' : 'Зареєструвати транзакцію'
          }
        </Button>
      </Form>
    </div>
  );
};

export default AddTransaction;
