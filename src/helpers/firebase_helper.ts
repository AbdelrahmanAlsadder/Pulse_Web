import firebase from "firebase/compat/app";

// Add the Firebase products that you want to use
import "firebase/compat/auth";
import "firebase/compat/firestore";
import "firebase/compat/storage";

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
      status: 0, // 1-admin 2-warehouse 3-pharmacy  (-1)- Disabled  0-pendding
      createdDtm: firebase.firestore.FieldValue.serverTimestamp(),
      lastLoginTime: firebase.firestore.FieldValue.serverTimestamp(),
    };
    collection.doc(firebase.auth().currentUser?.uid).set(details);
    return { user, details };
  };

  /*
    Returns the fetch Products
  */
  async fetchProducts(keyword = "") {
    try {
      if (this.uuid != undefined) {
        let query = this.firestore
          .collection("products")
          .where("store_id", "==", this.uuid); // Filter by store_id

        // If a keyword is provided, filter products by name or description
        if (keyword) {
          query = query
            .where("title", ">=", keyword)
            .where("title", "<=", keyword + "\uf8ff");
        }

        const querySnapshot = await query.get();

        return querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
      }
      // Return an empty array if uuid is undefined
      return [];
    } catch (error) {
      console.error("Error fetching products:", error);
      throw error;
    }
  }

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
  addProductToFirestore = (productData: any): Promise<any> => {
    return new Promise((resolve, reject) => {
      // Ensure user is authenticated before adding the product
      if (this.uuid) {
        const collection = this.firestore.collection("products");
        const newProduct = {
          ...productData,
          store_id: this.uuid, // Ensure the product is associated with the user's store
          createdDtm: firebase.firestore.FieldValue.serverTimestamp(), // Automatically set the creation timestamp
        };

        collection
          .add(newProduct)
          .then((docRef) => {
            resolve({ id: docRef.id, ...newProduct });
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
  getOrderByUID = async (): Promise<any[]> => {
    try {
      const ordersCollection = this.firestore.collection("orders");
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

              // Accumulate total amount for the order
              totalAmount += quantity * price;

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

            // Accumulate total amount for the order
            totalAmount += quantity * price;

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
