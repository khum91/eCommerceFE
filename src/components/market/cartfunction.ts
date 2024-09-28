interface Cart {
    id: string;
    name: string;
    sellerid: string;
    sellername: string;
    price: number;
    image: string;
    count: number;
}

class ShoppingCart {
    private cart: Cart[] = [];
    constructor() {
        this.loadCart();
    }

    private saveCart(): void {
        localStorage.setItem('Cart', JSON.stringify(this.cart));
    }

    private loadCart(): void {
        const loadedCart = JSON.parse(localStorage.getItem('Cart') || '[]');
        this.cart = loadedCart;
    }

    public addToCart(id: string, name: string, sellerid: string, sellername: string, price: number, image: string, count: number): void {
        for (const item of this.cart) {
            if (item.id === id) {
                item.count++;
                this.saveCart();
                return;
            }
        }
        const newCart: Cart = { id, name, sellerid, sellername, price, image, count };
        this.cart.push(newCart);
        this.saveCart();
    }

    public setCountForCart(id: string, count: number): void {
        for (const item of this.cart) {
            if (item.id === id) {
                item.count = count;
                break;
            }
        }
    }

    public decreaseCount(id: string): void {
        for (let i = 0; i < this.cart.length; i++) {
            if (this.cart[i].id === id) {
                this.cart[i].count--;
                if (this.cart[i].count === 0) {
                    this.cart.splice(i, 1);
                }
                break;
            }
        }
        this.saveCart();
    }

    public increaseCount(id: string): void {
        for (let i = 0; i < this.cart.length; i++) {
            if (this.cart[i].id === id) {
                this.cart[i].count++;
                break;
            }
        }
        this.saveCart();
    }

    public removeFromCart(id: string): void {
        for (let i = 0; i < this.cart.length; i++) {
            if (this.cart[i].id === id) {
                this.cart.splice(i, 1);
                break;
            }
        }
        this.saveCart();
    }

    public clearCart(): void {
        this.cart = [];
        this.saveCart();
    }

    public totalCount(): number {
        let totalCount = 0;
        for (const item of this.cart) {
            totalCount += item.count;
        }
        return totalCount;
    }

    public totalCart(): number {
        let totalCart = 0;
        for (const item of this.cart) {
            totalCart += item.price * item.count;
        }
        return Number(totalCart.toFixed(2));
    }

    public listCart(): Array<{ id: string; name: string; sellerid: string; sellername: string; price: number; count: number; total: number }> {
        const cartCopy: Array<{ id: string; name: string; sellerid: string; sellername: string; price: number; count: number; total: number }> = [];
        for (const item of this.cart) {
            const itemCopy = { ...item, total: Number((item.price * item.count).toFixed(2)) };
            cartCopy.push(itemCopy);
        }
        return cartCopy;
    }
}

const shoppingCart = new ShoppingCart();
export { shoppingCart }

