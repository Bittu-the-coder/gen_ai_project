class Cart {
  constructor(userId, items = []) {
    this.userId = userId;
    this.items = items; // Array of { productId, quantity, price, name, image }
    this.createdAt = new Date();
    this.updatedAt = new Date();
  }

  // Convert Firestore document to Cart instance
  static fromFirestore(doc) {
    const data = doc.data();
    return new Cart(data.userId, data.items || []);
  }

  // Convert Cart instance to Firestore format
  toFirestore() {
    return {
      userId: this.userId,
      items: this.items,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }

  // Add item to cart
  addItem(productId, quantity, price, name, image) {
    const existingItemIndex = this.items.findIndex(
      item => item.productId === productId
    );

    if (existingItemIndex > -1) {
      this.items[existingItemIndex].quantity += quantity;
    } else {
      this.items.push({
        productId,
        quantity,
        price,
        name,
        image,
        id: productId, // For frontend compatibility
      });
    }

    this.updatedAt = new Date();
  }

  // Update item quantity
  updateQuantity(productId, newQuantity) {
    if (newQuantity < 1) {
      this.removeItem(productId);
      return;
    }

    const itemIndex = this.items.findIndex(
      item => item.productId === productId
    );
    if (itemIndex > -1) {
      this.items[itemIndex].quantity = newQuantity;
      this.updatedAt = new Date();
    }
  }

  // Remove item from cart
  removeItem(productId) {
    this.items = this.items.filter(item => item.productId !== productId);
    this.updatedAt = new Date();
  }

  // Clear all items
  clear() {
    this.items = [];
    this.updatedAt = new Date();
  }

  // Get total amount
  getTotal() {
    return this.items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
  }
}

export default Cart;
