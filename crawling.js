const axios = require('axios');
const firebase = require('firebase');
const cheerio = require('cheerio');

const fbConfig = {
    apiKey: "AIzaSyBwc5tkZM3fEQcyPC1-HfguTbIt8woO9iA",
    authDomain: "shushu-cb26c.firebaseapp.com",
    databaseURL: "https://shushu-cb26c.firebaseio.com",
    storageBucket: "shushu-cb26c.appspot.com"
};

firebase.initializeApp(fbConfig);


firebase.database().ref('books/history/201902').once('value').then(snap => {
    for(let key in snap.val()) {
        crawler(key)
    }
})


const crawler = async (key) => {
    await new Promise(resolve => {
        axios.get(`https://www.aladin.co.kr/m/mproduct.aspx?ItemId=${key}`).then(response => {
            if (response.status === 200) {
                const html = response.data,
                    $ = cheerio.load(html),
                    src = $('.coversize').attr('src'),
                    title = $('.pdp_header_info .pdp_black').text(),
                    desc = $('.pdp_header_info .pdp_fwn').text();

                console.log(src, title, desc)
            }
        }).catch(function (error) {
            console.log(error);
        });
    })
    setTimeout(() => {
        console.log(11)
    },100)
}
