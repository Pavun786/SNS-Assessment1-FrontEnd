import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormLabel from "@mui/material/FormLabel";
import * as yup from "yup";
import { addExpense, fetchExpenses, fetchCategories, selectCategories } from "../features/expence/expenceSlice";

const expenseValidationSchema = yup.object({
  Amount: yup.number().required("Amount is required").min(1, "Amount must be positive"),
  Category: yup.string().required("Category is required"),
  Date: yup.date().required("Date is required"),
  Description: yup.string().required("Description is required"),
});

function AddExpence() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const categories = useSelector(selectCategories) || []; // Fallback to an empty array

  const { handleSubmit, values, handleChange, handleBlur, touched, errors } = useFormik({
    initialValues: {
      Amount: "",
      Category: "",
      Date: "",
      Description: "",
    },
    validationSchema: expenseValidationSchema,
    onSubmit: (newExpense) => {
      dispatch(addExpense(newExpense)).then(() => {
        // Fetch updated list of expenses after adding a new one
        dispatch(fetchExpenses());
        navigate("/getAll");
      });
    },
  });

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  return (
    <form className="smallBox" onSubmit={handleSubmit}>
      <h3>Expense Creation</h3>
      <TextField
        label="Amount"
        value={values.Amount}
        name="Amount"
        onChange={handleChange}
        onBlur={handleBlur}
        error={touched.Amount && Boolean(errors.Amount)}
        helperText={touched.Amount && errors.Amount ? errors.Amount : null}
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
        margin="normal"
      />
      <FormLabel id="category-radio-group-label">Category</FormLabel>
      <RadioGroup
        aria-labelledby="category-radio-group-label"
        value={values.Category}
        name="Category"
        onChange={handleChange}
      >
        {categories.map((category) => (
          <FormControlLabel
            key={category._id}
            value={category.CategoryName}
            control={<Radio />}
            label={category.CategoryName}
          />
        ))}
      </RadioGroup>
      <Button variant="contained" type="submit" margin="normal">
        Add Expense
      </Button>
    </form>
  );
}

export default AddExpence;
