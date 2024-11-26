import firebase from "firebase/compat/app";

// Add the Firebase products that you want to use
import "firebase/compat/auth";
import "firebase/compat/firestore";
import "firebase/compat/storage";
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import { toast } from "react-toastify";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

class FirebaseAuthBackend {
  firestore: firebase.firestore.Firestore;
  storage: firebase.storage.Storage;
  uuid: String | undefined;
  constructor(firebaseConfig: any) {
    if (firebaseConfig) {
      // Initialize Firebase
      firebase.initializeApp(firebaseConfig);
      this.storage = firebase.storage();
      firebase.auth().onAuthStateChanged((user: any) => {
        if (user) {
          console.log("user :>> ", user);
          this.uuid = user.uid;
          sessionStorage.setItem("authUser", JSON.stringify(user));
        } else {
          sessionStorage.removeItem("authUser");
        }
      });
    }
    this.storage = firebase.storage();
    this.firestore = firebase.firestore();
  }

  /**
   * Uploads a file to Firebase Storage and returns the download URL.
   * Allows specifying a custom path for saving the file, defaulting to 'uploads/'.
   */
  uploadFileToStorage = async (
    file: File,
    path: string = "uploads"
  ): Promise<string> => {
    try {
      const storageRef = this.storage.ref();
      const fileRef = storageRef.child(`${file.name}`);
      await fileRef.put(file);
      const downloadURL = await fileRef.getDownloadURL();
      return downloadURL;
    } catch (error) {
      console.error("Error uploading file:", error);
      throw error;
    }
  };

  /**
   * Registers the user with given details
   */
  registerUser = (email: any, password: any) => {
    return new Promise((resolve, reject) => {
      firebase
        .auth()
        .createUserWithEmailAndPassword(email, password)
        .then(
          (user: any) => {
            resolve(firebase.auth().currentUser);
          },
          (error: any) => {
            reject(this._handleError(error));
          }
        );
    });
  };

  /**
   * Registers the user with given details
   */
  editProfileAPI = (email: any, password: any) => {
    return new Promise((resolve, reject) => {
      firebase
        .auth()
        .createUserWithEmailAndPassword(email, password)
        .then(
          (user: any) => {
            resolve(firebase.auth().currentUser);
          },
          (error: any) => {
            reject(this._handleError(error));
          }
        );
    });
  };

  /**
   * Login user with given details
   */
  loginUser = (email: any, password: any) => {
    return new Promise((resolve, reject) => {
      firebase
        .auth()
        .signInWithEmailAndPassword(email, password)
        .then(
          (user: any) => {
            resolve(firebase.auth().currentUser);
          },
          (error: any) => {
            reject(this._handleError(error));
          }
        );
    });
  };

  /**
   * forget Password user with given details
   */
  forgetPassword = (email: any) => {
    return new Promise((resolve, reject) => {
      firebase
        .auth()
        .sendPasswordResetEmail(email, {
          url:
            window.location.protocol + "//" + window.location.host + "/login",
        })
        .then(() => {
          resolve(true);
        })
        .catch((error: any) => {
          reject(this._handleError(error));
        });
    });
  };



  /**
   * Logout the user
   */
  logout = () => {
    return new Promise((resolve, reject) => {
      firebase
        .auth()
        .signOut()
        .then(() => {
          resolve(true);
        })
        .catch((error: any) => {
          reject(this._handleError(error));
        });
    });
  };

  /**
   * Social Login user with given details
   */
  socialLoginUser = async (type: any) => {
    let provider: any;
    if (type === "google") {
      provider = new firebase.auth.GoogleAuthProvider();
    } else if (type === "facebook") {
      provider = new firebase.auth.FacebookAuthProvider();
    }
    try {
      const result = await firebase.auth().signInWithPopup(provider);
      const user = result.user;
      return user;
    } catch (error) {
      throw this._handleError(error);
    }
  };

  /*
  Returns the fetched user details by UID
*/
  getUserDetailsByUid = async (uid: string) => {
    try {
      const collection = firebase.firestore().collection("users");
      const userDoc = await collection.doc(uid).get();

      if (userDoc.exists) {
        return userDoc.data(); // returns the user's data if found
      } else {
        console.log("No user found with the given UID.");
        return null; // return null if no user found
      }
    } catch (error) {
      console.error("Error fetching user details:", error);
      return null; // return null in case of error
    }
  };

  // Function to update a user in the 'users' collection by UID
  async updateUserDetails(updatedData: any): Promise<void> {
    try {
      // Reference to the specific user's document
      const userRef = this.firestore.collection("users").doc(String(this.uuid));

      // Check if the document exists before attempting to update it
      const docSnapshot = await userRef.get();
      if (!docSnapshot.exists) {
        console.error("User document not found.");
        return; // User document not found, exit the function
      }

      // Update the user's document with the new data
      await userRef.update(updatedData);
      console.log("User updated successfully");
    } catch (error) {
      console.error("Error updating user:", error);
      throw error;
    }
  }

  // Function to update a user by ID
  async updateUserById(id: string, updatedData: any) {
    try {
      console.log("Submitting form with values2:", updatedData);
      const productRef = this.firestore.collection("users").doc(id);

      // Make sure the document exists
      const docSnapshot = await productRef.get();
      if (!docSnapshot.exists) {
        console.error("Document not found");
        return;
      }

      await productRef.update({
        status: updatedData.status,
      });

      console.log("User updated successfully");
    } catch (error: any) {
      if (error.code === "permission-denied") {
        console.error("Permission denied: Check Firestore rules.");
      } else if (error.code === "not-found") {
        console.error("Document not found.");
      } else {
        console.error("Error updating user:", error.message);
      }
      throw error;
    }
  }

  /*
    add New User To Firestore
  */
  addNewUserToFirestore = async (user: any) => {
    const collection = firebase.firestore().collection("users");
    // const { profile } = user.additionalUserInfo;
    let commercial_register;
    if (user.CommercialRegister) {
      // try {
      //   commercial_register = await this.uploadFileToStorage(
      //     user.CommercialRegister
      //   );
      // } catch (error) {
      //   console.error("Failed to upload commercial register:", error);
      // }
    }

    const details = {
      username: user.username,
      email: user.email,
      phone: user.phone,
      picture: "",
      commercial_register: commercial_register ?? "",
      status: 0, // 1-admin 2-warehouse 3-pharmacy  (-1)- Disabled  0-pending
      street: user.street,
      city: user.city,
      createdDtm: firebase.firestore.FieldValue.serverTimestamp(),
      lastLoginTime: firebase.firestore.FieldValue.serverTimestamp(),
    };
    collection.doc(firebase.auth().currentUser?.uid).set(details);
    return { user, details };
  };

  /*
    Returns the fetch Products
  */
    async fetchProducts(keyword = ""): Promise<any[]> {
      try {
        if (this.uuid !== undefined) {
          console.log("Fetching products for store_id:", this.uuid);
    
          let query = this.firestore
            .collection("products")
            .where("store_id", "==", this.uuid); // Filter by store_id
    
          // If a keyword is provided, filter products by name or description
          if (keyword) {
            console.log("Filtering products by keyword:", keyword);
            query = query
              .where("title", ">=", keyword)
              .where("title", "<=", keyword + "\uf8ff");
          }
    
          const querySnapshot = await query.get();
    
          const products = querySnapshot.docs.map((doc) => {
            const data = doc.data();
            console.log("Product fetched:", { id: doc.id, ...data });
            return {
              id: doc.id,
              ...data,
            };
          });
    
          console.log("Fetched products:", products);
          return products;
        }
    
        console.warn("UUID is undefined. Returning empty product list.");
        return [];
      } catch (error) {
        console.error("Error fetching products:", error);
        throw error;
      }
    }
    

  async fetchUsers(keyword = "") {
    try {
      // Use firebase.firestore.Query instead of CollectionReference
      let query: firebase.firestore.Query<firebase.firestore.DocumentData> =
        this.firestore.collection("users");

      // If a keyword is provided, filter users by title
      if (keyword) {
        query = query
          .where("username", ">=", keyword)
          .where("username", "<=", keyword + "\uf8ff");
      }

      const querySnapshot = await query.get();

      return querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
    } catch (error) {
      console.error("Error fetching users:", error);
      throw error;
    }
  }


/**
 * Check if all products in the specified order have a status other than 0.
 * @param orderId - The ID of the order to check.
 * @returns A promise that resolves to `true` if all products are not pending, `false` otherwise.
 */
  checkOrderProductsStatus = async (orderId: string): Promise<boolean> => {
  try {
    // Reference to the specific order document
    const orderRef = doc(this.firestore, 'orders', orderId);
    const orderSnapshot = await getDoc(orderRef);

    if (!orderSnapshot.exists()) {
      console.error('Order not found');
      return false;
    }

    const orderData = orderSnapshot.data();

    if (!orderData || !Array.isArray(orderData.product)) {
      console.error('Invalid order data');
      return false;
    }

    // Check if all products have a status different from 0
    const allProductsNotPending = orderData.product.every(
      (product: { status: number }) => product.status !== 0
    );

    return allProductsNotPending;
  } catch (error) {
    console.error('Error checking product statuses:', error);
    return false;
  }
};



  /**
   * Fetches a product by its ID
   * @param {string} id - The ID of the product document to fetch
   * @returns {Promise<any>} - A promise that resolves to the product data if found
   */
  getProductById = async (id: string): Promise<any> => {
    try {
      const productRef = this.firestore.collection("products").doc(id);
      const productDoc = await productRef.get();

      if (productDoc.exists) {
        return { id: productDoc.id, ...productDoc.data() }; // return product data if found
      } else {
        console.log("No product found with the given ID.");
        return null; // return null if no product found
      }
    } catch (error) {
      console.error("Error fetching product by ID:", error);
      throw error;
    }
  };

  // Function to update a product by ID
  async updateProductById(id: string, updatedData: any) {
    try {
      const productRef = this.firestore.collection("products").doc(id);
      await productRef.update({
        title: updatedData.title || "",
        images: updatedData.images || "",
        category: updatedData.category || "",
        price: updatedData.price || "",
        quantity: updatedData.quantity || "",
        expiryDate: updatedData.expiryDate || "",
      });
      console.log("Product updated successfully");
    } catch (error) {
      console.error("Error updating product:", error);
      throw error;
    }
  }

  // Function to delete a product by ID
  async deleteProductById(id: string) {
    try {
      const productRef = this.firestore.collection("products").doc(id);
      await productRef.delete();
      console.log("Product deleted successfully");
    } catch (error) {
      console.error("Error deleting product:", error);
      throw error;
    }
  }

  //return fetched categories
  async fetchCategories(keyword = "") {
    try {
      let query = this.firestore.collection("categories");

      // If a keyword is provided, filter products by name or description

      const querySnapshot = await query.get();

      return querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      // Return an empty array if uuid is undefined
      return [];
    } catch (error) {
      console.error("Error fetching Categories:", error);
      throw error;
    }
  }

  /**
   * Adds a new product to the products collection
   * @param {Object} productData - The product data to be added
   * @returns {Promise} - A promise that resolves when the product is added
   */


   addProductToFirestore = (productData: any, imageFile: File): Promise<any> => {
    return new Promise((resolve, reject) => {
      // Ensure user is authenticated before adding the product
      if (this.uuid) {
        const collection = this.firestore.collection("products");
        const storage = getStorage();
        
        // Ensure the image file name is correct
        if (!imageFile || !imageFile.name) {
          reject("No image file provided or image file name is undefined.");
          return;
        }
  
        const storageRef = ref(storage, `images/${imageFile.name}`);  // Using imageFile.name to set the file name
  
        console.log("Uploading image with filename:", imageFile.name);  // Log filename
  
        // Upload the image to Firebase Storage
        uploadBytes(storageRef, imageFile)
          .then((snapshot) => {
            // Get the download URL for the uploaded image
            return getDownloadURL(snapshot.ref);
          })
          .then((downloadURL) => {
            console.log("Image URL:", downloadURL);  // Log the URL to ensure it's correct
  
            // Add the image URL to the product data
            const newProduct = {
              ...productData,
              images: downloadURL,  // Store the image URL correctly
              store_id: this.uuid,  // Associate the product with the user's store
              createdDtm: firebase.firestore.FieldValue.serverTimestamp(), // Set the creation timestamp
            };
  
            // Add the product data with the image URL to Firestore
            return collection.add(newProduct);
          })
          .then((docRef) => {
            resolve({ id: docRef.id, ...productData });
          })
          .catch((error) => {
            reject(this._handleError(error));
          });
      } else {
        reject("User is not authenticated.");
      }
    });
  };
  
  


  /**
   * Retrieves all orders containing products from the specified store (by store ID).
   * Replaces user ID with user details and calculates the total amount for each order.
   * @param {string} uid - The store's user ID to filter orders by.
   * @returns {Promise<any[]>} - A promise that resolves to an array of orders with user details and total amount.
   */
  // to list the orders when their id is 0 or 1 the other status will be displayed in the 
  // invoice page
  getOrderByUID = async (): Promise<any[]> => {
    try {
      const ordersCollection = this.firestore.collection("orders")
        .where("status", "in", [1, 0]); // Filter orders based on order status (0 and 1)
      const ordersSnapshot = await ordersCollection.get();
      const orders = [];
  
      for (const orderDoc of ordersSnapshot.docs) {
        const orderData = orderDoc.data();
        let totalAmount = 0;
  
        // Filter products within the order based on store ID
        const filteredProducts = await Promise.all(
          orderData.products.map(async (productItem: any) => {
            const productData = await this.getProductById(productItem.product);
  
            if (productData && productData.store_id === this.uuid) {
              // Only calculate the total amount if the product's status is 0 or 1
              if (productItem.status === 0 || productItem.status === 1) {
                const quantity = productItem.quantity;
                const price = parseFloat(productData.price);
  
                // Accumulate total amount for the order
                totalAmount += quantity * price;
              }
  
              return {
                ...productItem,
                productDetails: productData,
                
              };
            }
  
            return null;
          })
        );
  
        const nonNullProducts = filteredProducts.filter(Boolean);
  
        if (nonNullProducts.length > 0) {
          // Fetch user details using getUserDetailsByUid method
          const userDetails = await this.getUserDetailsByUid(orderData.user_id);
  
          orders.push({
            id: orderDoc.id,
            ...orderData,
            products: nonNullProducts,
            user: userDetails,
            totalAmount,
          });
        }
      }
  
      return orders;
    } catch (error) {
      console.error("Error fetching orders by store UID:", error);
      throw error;
    }
  };
  
  
  //to list the orders invoice which status is -1 or 2 
  getOrderByUID2 = async (): Promise<any[]> => {
    try {
      const ordersCollection = this.firestore.collection("orders")
      .where("status", "in", [2, -1]); // Filter orders based on status;
      const ordersSnapshot = await ordersCollection.get();
      const orders = [];

      for (const orderDoc of ordersSnapshot.docs) {
        const orderData = orderDoc.data();
        let totalAmount = 0;

        // Filter products within the order based on store ID
        const filteredProducts = await Promise.all(
          orderData.products.map(async (productItem: any) => {
            const productData = await this.getProductById(productItem.product);

            if (productData && productData.store_id === this.uuid) {
              const quantity = productItem.quantity;
              const price = parseFloat(productData.price);

              if (productItem.status === 0 || productItem.status === 1) {
                const quantity = productItem.quantity;
                const price = parseFloat(productData.price);
  
                // Accumulate total amount for the order
                totalAmount += quantity * price;
              }

              return {
                ...productItem,
                productDetails: productData,
              };
            }

            return null;
          })
        );

        const nonNullProducts = filteredProducts.filter(Boolean);

        if (nonNullProducts.length > 0) {
          // Fetch user details using getUserDetailsByUid method
          const userDetails = await this.getUserDetailsByUid(orderData.user_id);

          orders.push({
            id: orderDoc.id,
            ...orderData,
            products: nonNullProducts,
            user: userDetails,
            totalAmount,
          });
        }
      }

      return orders;
    } catch (error) {
      console.error("Error fetching orders by store UID:", error);
      throw error;
    }
  };
// to return the top 6 recent invoices only
getOrderByUID3 = async (): Promise<any[]> => {
  try {
    const ordersCollection = this.firestore.collection("orders")
      .where("status", "in", [2, -1])  // Filter orders based on status
      .orderBy("date", "desc")  // Order by the 'date' field which is a Timestamp
      .limit(6);  // Limit to the top 6 latest orders

    const ordersSnapshot = await ordersCollection.get();
    const orders = [];

    for (const orderDoc of ordersSnapshot.docs) {
      const orderData = orderDoc.data();
      let totalAmount = 0;

      // Filter products within the order based on store ID
      const filteredProducts = await Promise.all(
        orderData.products.map(async (productItem: any) => {
          const productData = await this.getProductById(productItem.product);

          if (productData && productData.store_id === this.uuid) {
            const quantity = productItem.quantity;
            const price = parseFloat(productData.price);

            if (productItem.status === 0 || productItem.status === 1) {
              const quantity = productItem.quantity;
              const price = parseFloat(productData.price);

              // Accumulate total amount for the order
              totalAmount += quantity * price;
            }

            return {
              ...productItem,
              productDetails: productData,
            };
          }

          return null;
        })
      );

      const nonNullProducts = filteredProducts.filter(Boolean);

      if (nonNullProducts.length > 0) {
        // Fetch user details using getUserDetailsByUid method
        const userDetails = await this.getUserDetailsByUid(orderData.user_id);

        orders.push({
          id: orderDoc.id,
          ...orderData,
          products: nonNullProducts,
          user: userDetails,
          totalAmount,
        });
      }
    }

    return orders;
  } catch (error) {
    console.error("Error fetching orders by store UID:", error);
    throw error;
  }
};



  /**
   * Retrieves a specific order by its ID, containing products from the specified store (by store ID).
   * Replaces user ID with user details and calculates the total amount for the order.
   * @param {string} orderId - The ID of the order to retrieve.
   * @returns {Promise<any>} - A promise that resolves to the order with user details and total amount.
   */
  getOrderById = async (orderId: string): Promise<any> => {
    try {
      const orderDoc = await this.firestore
        .collection("orders")
        .doc(orderId)
        .get();

      if (!orderDoc.exists) {
        throw new Error("Order not found");
      }

      const orderData = orderDoc.data(); // TypeScript will infer this as `any | undefined`

      if (!orderData) {
        throw new Error("Order data is undefined");
      }

      let totalAmount = 0;

      // Filter products within the order based on store ID
      const filteredProducts = await Promise.all(
        orderData.products.map(async (productItem: any) => {
          const productData = await this.getProductById(productItem.product);

          if (productData && productData.store_id === this.uuid) {
            const quantity = productItem.quantity;
            const price = parseFloat(productData.price);

            if (productItem.status === 0 || productItem.status === 1) {
              const quantity = productItem.quantity;
              const price = parseFloat(productData.price);

              // Accumulate total amount for the order
              totalAmount += quantity * price;
            }

            return {
              ...productItem,
              productDetails: productData,
            };
          }

          return null;
        })
      );

      const nonNullProducts = filteredProducts.filter(Boolean);

      if (nonNullProducts.length > 0) {
        // Fetch user details using getUserDetailsByUid method
        const userDetails = await this.getUserDetailsByUid(orderData.user_id);

        return {
          orderId: orderDoc.id, // Include the order ID
          ...orderData,
          products: nonNullProducts,
          user: userDetails,
          totalAmount,
        };
      }

      // If no valid products are found, return null or handle it as needed
      return null;
    } catch (error) {
      console.error("Error fetching order by ID:", error);
      throw error;
    }
  };


    
  

  /**
   * Updates the status of the order by order ID.
   * @param {string} orderId - The ID of the order to update.
   * @param {string} newStatus - The new status to set for the order.
   * @returns {Promise<any>} - A promise that resolves to the updated order data.
   */
  updateOrderStatus = async (
    orderId: string,
    newStatus: string
  ): Promise<any> => {
    try {
      const orderRef = this.firestore.collection("orders").doc(orderId);

      // Update the order status
      await orderRef.update({
        status: newStatus,
        updatedDtm: firebase.firestore.FieldValue.serverTimestamp(),
      });

      // Fetch the updated order details
      const updatedOrderDoc = await orderRef.get();
      if (updatedOrderDoc.exists) {
        return { id: updatedOrderDoc.id, ...updatedOrderDoc.data() };
      } else {
        throw new Error("Order not found");
      }
    } catch (error) {
      console.error("Error updating order status:", error);
      throw error;
    }
  };

  /**
   * Updates the status of a specific item in the order.
   * @param {string} orderId - The ID of the order containing the item.
   * @param {string} productId - The ID of the product within the order.
   * @param {string} newStatus - The new status to set for the item.
   * @returns {Promise<any>} - A promise that resolves to the updated order data with the modified item status.
   */

  adjustStockBasedOnStatus = (
    status: number,
    currentStock: number,
    quantityToUpdate: number
  ) => {
    let updatedStock = currentStock;
  
    console.log("New Status:", status);
    if (status === 1) {
      // Decrease stock when changing to active
      updatedStock = currentStock - quantityToUpdate;
      console.log("The updated stock (set to active) is:", updatedStock);
    } else if (status === 0 || status === -1) {
      // Increase stock when changing to inactive (0 or -1)
      updatedStock = currentStock + quantityToUpdate;
      console.log("The updated stock (set to inactive) is:", updatedStock);
    }
  
    return updatedStock;
  };
  async updateOrderItemStatus(
    orderId: string,
    productId: string,
    newStatus: number
  ): Promise<any> {
    try {
      const orderRef = this.firestore.collection("orders").doc(orderId);
      const orderDoc = await orderRef.get();
  
      if (!orderDoc.exists) {
        throw new Error("Order not found");
      }
  
      const orderData = orderDoc.data();
  
      // Find the existing product in the order
      const existingProduct = orderData?.products.find(
        (item: any) => item.product === productId
      );
  
      if (!existingProduct) {
        throw new Error("Product not found in the order");
      }
  
      const previousStatus = existingProduct.status; // Get the previous status
  
      // Update the product's status in the order
      const updatedProducts = orderData?.products.map((item: any) => {
        if (item.product === productId) {
          return { ...item, status: newStatus };
        }
        return item;
      });
  
      // Step 3: Fetch the product details from the "products" collection
      const productRef = this.firestore.collection("products").doc(productId);
      const productDoc = await productRef.get();
  
      if (!productDoc.exists) {
        throw new Error("Product not found in the products collection");
      }
  
      const productData = productDoc.data();
      const currentStock = productData?.quantity || 0;
      const quantityToUpdate = existingProduct.quantity || 0;
  
      let updatedStock = currentStock;
  
      // Step 4: Adjust stock based on status changes
      if (previousStatus !== newStatus) {
        if (previousStatus === 1 && (newStatus === 0 || newStatus === -1)) {
          // If moving from Approved (1) to Pending (0) or Rejected (-1) -> Increase Stock
          updatedStock = currentStock + quantityToUpdate;
          console.log(
            `Stock increased due to status change from 1 to ${newStatus}, new stock: ${updatedStock}`
          );
        } else if ((previousStatus === 0 || previousStatus === -1) && newStatus === 1) {
          // If moving from Pending (0) or Rejected (-1) to Approved (1) -> Decrease Stock
          updatedStock = currentStock - quantityToUpdate;
  
          // **New Check**: Prevent stock from going negative
          if (updatedStock < 0) {
            console.error(
              `Insufficient stock to approve the order. Current stock: ${currentStock}, Requested quantity: ${quantityToUpdate}`
              
            );
            toast.error("UnderStock, Please Check the Product Stock.", { autoClose: 2000 });
            throw new Error(
              "Cannot approve order. Not enough stock available."
            );
          }
  
          console.log(
            `Stock decreased due to status change to active, new stock: ${updatedStock}`
          );
        } else {
          // If the status changes between 0 and -1, do nothing to the stock
          updatedStock = currentStock;
          console.log(
            `No stock change for status change from ${previousStatus} to ${newStatus}`
          );
        }
      }
  
      // Step 5: Update the product's stock in Firestore if it changed
      if (updatedStock !== currentStock) {
        await productRef.update({ quantity: updatedStock });
        console.log(`Product quantity updated for ${productId}, new stock: ${updatedStock}`);
      }
  
      // Step 6: Update the order with the modified item status
      await orderRef.update({
        products: updatedProducts,
        updatedDtm: firebase.firestore.FieldValue.serverTimestamp(),
      });
  
      // Fetch and return the updated order
      const updatedOrderDoc = await orderRef.get();
      return { id: updatedOrderDoc.id, ...updatedOrderDoc.data() };
    } catch (error) {
      console.error("Error updating order item status:", error);
      throw error;
    }
  }
  
  
  
  
  updateProductQuantity = async (productId: string, quantityToUpdate: number, status: string): Promise<void> => {
   
    try {
      // Get the product document
      const productRef = this.firestore.collection("products").doc(productId);
      const productDoc = await productRef.get();
  
      if (!productDoc.exists) {
        throw new Error("Product not found");
      }
  
      const productData = productDoc.data();
      const currentStock = productData?.quantity || 0; // Get the current stock quantity
  
      let updatedStock = currentStock;
      
      const statusString = String(status); // Ensure it's a string
console.log("Status after conversion:", statusString);

        if (statusString === '1') {
          updatedStock = currentStock - quantityToUpdate;
          console.log("The updated stock (status 1) is:", updatedStock);
        }

        if (statusString === '0' || statusString === '-1') {
          updatedStock = currentStock + quantityToUpdate;
          console.log("The updated stock (status 0 or -1) is:", updatedStock);
        }

  
      // Update the product quantity in the Firestore database
      console.log("the updated stock is"+updatedStock)
      await productRef.update({
       
        quantity: updatedStock,
      });
  
      console.log(`Product quantity updated for ${productId}, new stock: ${updatedStock}`);
    } catch (error) {
      console.error("Error updating product quantity:", error);
    }
  };
    
  

  setLoggeedInUser = (user: any) => {
    sessionStorage.setItem("authUser", JSON.stringify(user));
  };

  /**
   * Returns the authenticated user
   */
  getAuthenticatedUser = () => {
    if (!sessionStorage.getItem("authUser")) return null;
    return JSON.parse(sessionStorage.getItem("authUser") || "");
  };

  /**
   * Handle the error
   * @param {*} error
   */
  _handleError(error: any) {
    // var errorCode = error.code;
    var errorMessage = error.message;
    return errorMessage;
  }
}

let _fireBaseBackend: any = null;

/**
 * Initilize the backend
 * @param {*} config
 */
const initFirebaseBackend = (config: any) => {
  if (!_fireBaseBackend) {
    _fireBaseBackend = new FirebaseAuthBackend(config);
  }
  return _fireBaseBackend;
};

/**
 * Returns the firebase backend
 */
const getFirebaseBackend = () => {
  return _fireBaseBackend;
};

export { initFirebaseBackend, getFirebaseBackend };
