import { createAsyncThunk } from "@reduxjs/toolkit";
import 'react-toastify/dist/ReactToastify.css';
import { toast } from "react-toastify";



export const getTransactionData = createAsyncThunk("invoice/getTransactionData", async () => {
    try {
     
        
    } catch (error) {
        return error;
    }
});

export const getClientInvoices = createAsyncThunk("invoice/getClientInvoices", async () => {
  try {
   
    
  } catch (error) {
      return error;
  }
});

export const editClientInvoices = createAsyncThunk("invoice/editClientInvoices", async (invoice: any) => {
  try {
      
    
      toast.success("Invoices edited Successfully", { autoClose: 2000 });
     
  } catch (error) {
      toast.error("Invoices edited Failed", { autoClose: 2000 });
      return error;
  }
});

export const deleteClientInvoices = createAsyncThunk("invoice/deleteClientInvoices", async (id: any) => {
  try {
   
      toast.success("Invoice Deleted Successfully", { autoClose: 2000 });
      
  } catch (error) {
      toast.error("Invoice Deleted Failed", { autoClose: 2000 });
      return error;
  }
});


export const getPaymentSummary = createAsyncThunk("invoice/getPaymentSummary", async () => {
  try {
  
    
  } catch (error) {
      return error;
  }
});

export const editPaymentSummary = createAsyncThunk("invoice/editPaymentSummary", async (paymentsummary: any) => {
  try {
    

      toast.success("Payment summary edited Successfully", { autoClose: 2000 });
     
  } catch (error) {
      toast.error("Payment summary edited Updated Failed", { autoClose: 2000 });
      return error;
  }
});

export const deletePaymentSummary = createAsyncThunk("invoice/deletePaymentSummary", async (id: any) => {
  try {
     
      toast.success("Payment Summary Report Deleted Successfully", { autoClose: 2000 });
   
  } catch (error) {
      toast.error("Payment Summary Report Deleted Failed", { autoClose: 2000 });
      return error;
  }
});

export const getUsers = createAsyncThunk("invoice/getUsers", async () => {
  try {
 
     
  } catch (error) {
      return error;
  }
});

export const addUsers = createAsyncThunk("invoice/addUsers", async (user: any) => {
  try {
     
    
      toast.success("Invoices Added Successfully", { autoClose: 2000 });
   
  } catch (error) {
      toast.error("Invoices Added Failed", { autoClose: 2000 });
      return error;
  }
});

export const editUsers = createAsyncThunk("invoice/editUsers", async (user: any) => {
  try {
    
     
      toast.success("User edited Successfully", { autoClose: 2000 });
      
  } catch (error) {
      toast.error("User edited Failed", { autoClose: 2000 });
      return error;
  }
});

export const deleteUsers = createAsyncThunk("invoice/deleteUsers", async (id: any) => {
  try {
     
      toast.success("User deleted Successfully", { autoClose: 2000 });
     
  } catch (error) {
      toast.error("User deleted Failed", { autoClose: 2000 });
      return error;
  }
});

export const getProductList = createAsyncThunk("invoice/getProductList", async () => {
  try {
    
      
  } catch (error) {
      return error;
  }
});

export const editProductList = createAsyncThunk("invoice/editProductList", async (product: any) => {
  try {
    
     
      toast.success("Product edited Successfully", { autoClose: 2000 });
    
  } catch (error) {
      toast.error("Product edited Failed", { autoClose: 2000 });
      return error;
  }
});

export const deleteProductList = createAsyncThunk("invoice/deleteProductList", async (id: any) => {
  try {
     
      toast.success("Product deleted Successfully", { autoClose: 1000 });
     
  } catch (error) {
      toast.error("Product deleted Failed", { autoClose: 1000 });
      return error;
  }
});

export const getPayments = createAsyncThunk("invoice/getPayments", async () => {
  try {
  
  } catch (error) {
      return error;
  }
});

export const addPayment = createAsyncThunk("invoice/addPayment", async (user: any) => {
  try {
    
   
      toast.success("Payment added Successfully", { autoClose: 2000 });
     
  } catch (error) {
      toast.error("Payment added Failed", { autoClose: 2000 });
      return error;
  }
});

export const editPayment = createAsyncThunk("invoice/editPayment", async (payment: any) => {
  try {

    
      toast.success("Payment edited Successfully", { autoClose: 2000 });
   
  } catch (error) {
      toast.error("Payment edited Failed", { autoClose: 2000 });
      return error;
  }
});

export const deletePayment = createAsyncThunk("invoice/deletePayment", async (id: any) => {
  try {
    
      toast.success("Payment deleted Successfully", { autoClose: 1000 });
    
  } catch (error) {
      toast.error("Payment deleted Failed", { autoClose: 1000 });
      return error;
  }
});