const Customer = require('../models/Customer');
const Product = require('../models/Product');

// Calculate total cart value
const calculateTotal = async (cart) => {
    let total = 0;
    for (const item of cart) {
        const product = await Product.findOne({ productId: item.productId });
        if (product) {
            total += product.price * item.quantity;
        }
    }
    return total;
};

exports.addToCart = async (req, res) => {
    try {
        const { productId, quantity = 1 } = req.body;
        const customerId = req.user._id;

        const customer = await Customer.findById(customerId);
        if (!customer) return res.status(404).json({ message: 'Customer not found' });

        // Check if product exists
        const product = await Product.findOne({ productId });
        if (!product) return res.status(404).json({ message: 'Product not found' });

        const existingItemIndex = customer.cart.findIndex(item => item.productId === Number(productId));

        if (existingItemIndex > -1) {
            // Update quantity
            customer.cart[existingItemIndex].quantity += Number(quantity);
        } else {
            // Add new item
            customer.cart.push({ productId: Number(productId), quantity: Number(quantity) });
        }

        customer.cartTotal = await calculateTotal(customer.cart);
        await customer.save();

        res.json({ message: 'Cart updated', cart: customer.cart, cartTotal: customer.cartTotal });
    } catch (error) {
        console.error("addToCart Error:", error);
        res.status(500).json({ message: error.message });
    }
};

exports.removeFromCart = async (req, res) => {
    try {
        const { productId } = req.body; // If strictly removing
        const customerId = req.user._id;

        const customer = await Customer.findById(customerId);
        if (!customer) return res.status(404).json({ message: 'Customer not found' });

        customer.cart = customer.cart.filter(item => item.productId !== Number(productId));
        customer.cartTotal = await calculateTotal(customer.cart);
        await customer.save();

        res.json({ message: 'Item removed from cart', cart: customer.cart, cartTotal: customer.cartTotal });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.updateCartItemQuantity = async (req, res) => {
    try {
        const { productId, quantity } = req.body;
        const customerId = req.user._id;

        const customer = await Customer.findById(customerId);
        if (!customer) return res.status(404).json({ message: 'Customer not found' });

        const itemIndex = customer.cart.findIndex(item => item.productId === Number(productId));

        if (itemIndex > -1) {
            if (quantity <= 0) {
                // Remove if quantity is 0 or less
                customer.cart.splice(itemIndex, 1);
            } else {
                customer.cart[itemIndex].quantity = Number(quantity);
            }

            customer.cartTotal = await calculateTotal(customer.cart);
            await customer.save();
            res.json({ message: 'Cart updated', cart: customer.cart, cartTotal: customer.cartTotal });
        } else {
            res.status(404).json({ message: 'Item not in cart' });
        }

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

exports.getCart = async (req, res) => {
    try {
        const customerId = req.user._id;
        const customer = await Customer.findById(customerId);

        if (!customer) return res.status(404).json({ message: 'Customer not found' });

        // Populate product details manually since we store productId (Number) not ObjectId
        const cartItems = [];
        for (const item of customer.cart) {
            const product = await Product.findOne({ productId: item.productId });
            if (product) {
                cartItems.push({
                    productId: item.productId,
                    quantity: item.quantity,
                    product: product
                });
            }
        }

        res.json({ cart: cartItems, cartTotal: customer.cartTotal });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
