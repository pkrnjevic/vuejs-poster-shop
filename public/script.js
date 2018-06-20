var PRICE = 9.99
var LOAD_NUM = 10

new Vue({
    el: '#app',
    data: {
        results: [],
        items: [],
        cart: [],
        search: '90s',
        prevsearch: '',
        loading: true,
        price: PRICE
    },
    computed: {
        total: function () {
            let total = 0
            for (i of this.cart) {
                total += i.price * i.qty
            }
            return total
        },
        atBottom: function () {
            return this.items.length === this.results.length && this.results.length > 0
        }
    },
    methods: {
        appendItems: function () {
            var len = this.items.length
            if (len < this.results.length) {
                this.items = this.items.concat(this.results.slice(len, len + LOAD_NUM))
            }
        },
        onSubmit: function () {
            if (!this.search) return
            this.items = []
            this.loading = true
            this.$http
                .get('/search/' + this.search)
                .then(
                    function (res) {
                        this.results = res.data
                        for (i of this.results) {
                            i.price = this.price
                        }
                        this.appendItems()
                        this.prevsearch = this.search
                        this.loading = false
                    },
                    function (err) {})
        },
        addItem: function (item) {
            for (i of this.cart) {
                if (i.id === item.id) {
                    i.qty++
                        return
                }
            }
            this.cart.push(Object.assign({
                qty: 1
            }, item));
        },
        inc: function (item) {
            item.qty++
        },
        dec: function (item) {
            item.qty--
                if (item.qty <= 0) {
                    let i = this.cart.findIndex(function (citem) {
                        return citem.id === item.id
                    })
                    this.cart.splice(i, 1)
                }
        }
    },
    filters: {
        currency: (price) => {
            return '$' + price.toFixed(2)
        }
    },
    mounted: function () {
        this.onSubmit()
        // var self = this
        var elem = document.getElementById('product-list-bottom')
        var watcher = scrollMonitor.create(elem)
        watcher.enterViewport(() => {
            this.appendItems()
        })
    }
});