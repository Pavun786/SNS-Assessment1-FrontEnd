import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { useFormik } from "formik";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormLabel from "@mui/material/FormLabel";
import * as yup from "yup";
import { API } from "../Global.js";
import { fetchCategories, selectCategories } from "../features/expence/expenceSlice.js";
import { updateExpense, fetchExpenseById, fetchExpenses } from "../features/expence/expenceSlice.js";

const expenseValidationSchema = yup.object({
  Amount: yup.number().required("Amount is required").min(1, "Amount must be positive"),
  Category: yup.string().required("Category is required"),
  Date: yup.date().required("Date is required"),
  Description: yup.string().required("Description is required"),
});

// Convert ISO date string to YYYY-MM-DD
const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toISOString().split('T')[0];
};

function EditExpence() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  const categories = useSelector(selectCategories) || [];

  useEffect(() => {
    dispatch(fetchCategories());
    dispatch(fetchExpenseById(id));
  }, [dispatch, id]);

  const { handleSubmit, values, handleChange, handleBlur, touched, errors, setFieldValue } = useFormik({
    initialValues: {
      Amount: "",
      Category: "",
      Date: "",
      Description: "",
    },
    validationSchema: expenseValidationSchema,
    onSubmit: (updatedExpense) => {
      const selectedCategory = categories.find(cat => cat.CategoryName === updatedExpense.Category);
      updatedExpense.Category = selectedCategory ? selectedCategory._id : null;
      dispatch(updateExpense({ id, updatedExpense })).then(() => {
        // Fetch updated list of expenses after adding a new one
        dispatch(fetchExpenses());
        navigate("/getAll");
      })
    },
  });

  const getExpenseById = async () => {
    try {
      const expenseData = await fetch(`${API}/expence/${id}`, { method: "GET" });
      const expense = await expenseData.json();
      setFieldValue("Amount", expense.Amount);
      setFieldValue("Date", formatDate(expense.Date));
      setFieldValue("Description", expense.Description);
      setFieldValue("Category", expense.Category.CategoryName);
    } catch (error) {
      console.error("Failed to fetch expense:", error);
    }
  };

  useEffect(() => {
    getExpenseById();
  }, [id]);

  return (
    <form className="smallBox" onSubmit={handleSubmit}>
      <h3>Edit Expense Form</h3>
      <TextField
        label="Amount"
        value={values.Amount}
        name="Amount"
        onChange={handleChange}
        onBlur={handleBlur}
        error={touched.Amount && Boolean(errors.Amount)}
        helperText={touched.Amount && errors.Amount ? errors.Amount : null}
        fullWidth
        margin="normal"
      />
      <TextField
        label="Date"
        type="date"
        value={values.Date}
        name="Date"
        onChange={handleChange}
        onBlur={handleBlur}
        error={touched.Date && Boolean(errors.Date)}
        helperText={touched.Date && errors.Date ? errors.Date : null}
        fullWidth
        margin="normal"
        InputLabelProps={{ shrink: true }}
      />
      <TextField
        label="Description"
        value={values.Description}
        name="Description"
        onChange={handleChange}
        onBlur={handleBlur}
        error={touched.Description && Boolean(errors.Description)}
        helperText={touched.Description && errors.Description ? errors.Description : null}
        fullWidth
        margin="normal"
      />
      <FormLabel id="category-radio-group-label">Category</FormLabel>
      <RadioGroup
        aria-labelledby="category-radio-group-label"
        value={values.Category}
        name="Category"
        onChange={handleChange}
      >
        {categories.map((ele) => (
          <FormControlLabel key={ele._id} value={ele.CategoryName} control={<Radio />} label={ele.CategoryName} />
        ))}
      </RadioGroup>
      <Button variant="contained" type="submit" fullWidth margin="normal">
        Update Expense
      </Button>
    </form>
  );
}

export default EditExpence;
