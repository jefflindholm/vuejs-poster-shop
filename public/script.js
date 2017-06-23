function makePrice() {
    return Math.round((Math.random() * (20 - 5) + 5) * 100) / 100;
}
new Vue({
    el: '#app',
    data: {
        total: 0,
        items: [],
        cart: [],
        searchText: '',
        lastSearchText: '',
        isLoading: false,
    },
    methods: {
        search() {
            this.items = [];
            this.isLoading = true;
            if (!this.searchText) return;
            fetch(`/search/${this.searchText}`)
                .then(res => res.json())
                .then((res) => {
                    this.items = res.map(r => ({
                        id: r.id,
                        title: r.title,
                        price: makePrice(),
                        link: r.link,
                    }))
                    this.isLoading = false;
                    this.lastSearchText = this.searchText;
                })
                .catch(err => console.log(err))
            ;
        },
        addItem(idx) {
            const item = this.items[idx];
            const cartItem = this.cart.find(c => c.id === item.id);
            if (!cartItem) {
                this.cart.push(Object.assign({}, item, {quantity: 1}));
            } else {
                cartItem.quantity += 1;
            }
            this.total += item.price;
        },
        inc(item) {
            item.quantity += 1;
            this.total += item.price;
        },
        dec(item) {
            item.quantity -= 1;
            this.total -= item.price;
            if (item.quantity < 1) {
                this.cart.splice(this.cart.indexOf(item), 1)
            }
        },
    },
    filters: {
        currency(value) {
            return `$${value.toFixed(2)}`;
        }
    },
    //lifecycle
    mounted() {
        this.searchText = 'anime';
        this.search();
    }
})
