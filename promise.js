<script>
    import firebase from 'firebase';
    let db = firebase.database();

    export default{
        name: 'Login',
        data () {
            return {
                books: ''
            }
        },
        created () {
            this.fetchData()
        },
        watch: {
            '$route': 'fetchData'
        },
        methods: {
            fetchData () {
                let zzz;

                let pm1 = new Promise((resolve, reject) => {
                    db.ref('books/list').on('value', d => {
                        resolve(d.val());
                        zzz = d.val();
                    })
                });

                let pm0 = new Promise((resolve, reject) => {
                    pm1.then( d => {
                        let size = Object.keys(d).length, cnt = 0, temp = [];

                        for (let item in d) {
                            db.ref(`books/rent/${item}`).once('value').then(z => {
                                ++cnt;

                                zzz[item] = Object.assign(zzz[item], z.val());

                                if (cnt >= size) {
                                   resolve(zzz)
                                }
                            });
                        }
                    })
                });


                let pm2 = new Promise((resolve, reject) => {
                    pm0.then(d => {
                        let size = Object.keys(d).length, cnt = 0, temp = [];

                        for (let item in d) {
                            if (d[item]) {
                                db.ref(`users/${d[item].uid}`).once('value').then(c => {
                                    ++cnt;

                                    d[item] = Object.assign(d[item], c.val())
                                    if (cnt >= size) {
                                        resolve(d)
                                    }
                                })
                            } else { cnt++ }
                        }
                    })
                });

                pm2.then(d => this.books = d);


                db.ref('books/list').once('value').then(d => {
                    let k = d.val();


                    /*for (let item in d.val()) {
                        db.ref(`books/rent/${item}`).once('value').then(z => {
                            k[item] = Object.assign(k[item], z.val())
                            if (k[item].uid) {

                            }
                         })
                    }
                    this.books = k;*/
                })
            }
        }
    }
</script>
