import {Category} from "../../../../schemas/responses/models/Category.ts";
import {useState} from "react";

const ViewCategories = () => {
    const [categories: Category[], setCategories] = useState([]);
    const [categoriesPage: number, setCategoriesPage] = useState(1);
}

export default ViewCategories;