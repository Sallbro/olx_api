const express = require('express');
const app = express();
// const cheerio = require('cheerio');
const axios = require('axios');
const dotenv = require('dotenv');
dotenv.config();
const port = process.env['PORT'] || 9330;

// get verification 
app.get('/', (req, res) => {
    try {

        res.status(200).send("working fine !...");
    }
    catch (err) {
        res.status(500).send("something went wrong !...");
    }
});

// page no 
app.get('/page/:page_no', async (req, res) => {
    const page_no = req.params.page_no;
    let act_url = process.env['GET_PAGE_URL'];
    act_url = act_url.replace("${page_no}", page_no);
    axios.get(act_url).then((response) => {
        const pages = [];
        for (dt of response.data.data) {
            const res_data = {}
            res_data.item_id = dt?.id;
            res_data.status = dt?.status?.status;
            res_data.added = dt?.created_at_first;


            res_data.title = dt?.title;
            res_data.description = dt?.description;

            res_data.price = {
                currency: dt?.price?.value?.currency?.iso_4217,
                value: dt?.price?.value?.raw
            };

            const images = [];
            for (img of dt.images) {
                images.push(img.full.url);
            }
            res_data.images = images;
            res_data.videos = dt.videos;

            res_data.parameters = dt?.parameters;

            res_data.locations = {
                name: dt?.locations_resolved?.COUNTRY_name + "," + dt?.locations_resolved?.ADMIN_LEVEL_1_name + "," + dt?.locations_resolved?.SUBLOCALITY_LEVEL_1_name,
                lat: dt?.locations[0].lat,
                lon: dt?.locations[0].lon

            };

            res_data.user_id = dt?.user_id;
            res_data.category_id = dt?.category_id;
            res_data.ad_id = dt?.ad_id;


            pages.push(res_data);
        }
        res.send(pages);
        // res.send(response.data);
        res.end();
    }).catch((err) => {
        console.error(err);
        res.end();
    });
});

// single item details
app.get('/single_item/:item_id', async (req, res) => {
    const item_id = req.params.item_id;
    console.log("item_id-", item_id);
    let act_url = process.env['GET_SINGLE_ITEM_URL'];
    act_url = act_url.replace("${item_id}", item_id);
    console.log("act_url-", act_url);
    axios.post(process.env['GET_COOKIE_URL']).then((resp) => {
        console.log("sallbro2-", resp.headers);
        axios.get(act_url, resp.headers).then((response) => {
            console.log("sallbrobhai2-", response.data);
            res.status(200).send(response.data);
            res.end();
        }).catch((err) => {
            res.send(err);
            console.log(err);
            res.end();
        });
    }).catch((err) => {
        res.send(err);
        console.log(err);
        res.end();
    });

});

// recommendation item 
app.get('/recommendation/:ad_id', async (req, res) => {
    const ad_id = req.params.ad_id;
    let act_url = process.env['GET_RECOMMENDATION_URL'];
    act_url = act_url.replace("${ad_id}", ad_id);
    axios.get(act_url).then((response) => {
        const recommendation_items = [];
        for (dt of response.data.data) {
            const res_data = {}
            res_data.item_id = dt?.id;
            res_data.status = dt?.status?.status;
            res_data.added = dt?.created_at_first;


            res_data.title = dt?.title;
            res_data.description = dt?.description;

            res_data.price = {
                currency: dt?.price?.value?.currency?.iso_4217,
                value: dt?.price?.value?.raw
            };

            const images = [];
            for (img of dt.images) {
                images.push(img.full.url);
            }
            res_data.images = images;
            res_data.videos = dt.videos;

            res_data.parameters = dt?.parameters;

            res_data.locations = {
                name: dt?.locations_resolved?.COUNTRY_name + "," + dt?.locations_resolved?.ADMIN_LEVEL_1_name + "," + dt?.locations_resolved?.SUBLOCALITY_LEVEL_1_name,
                lat: dt?.locations[0].lat,
                lon: dt?.locations[0].lon

            };

            res_data.user_id = dt?.user_id;
            res_data.category_id = dt?.category_id;
            res_data.ad_id = dt?.ad_id;


            recommendation_items.push(res_data);
        }
        res.send(recommendation_items);
        // res.send(response.data);
        res.end();
    }).catch((err) => {
        console.error(err);
        res.end();
    });
});

// user profile items
app.get('/user_profile/:user_id', async (req, res) => {
    const user_id = req.params.user_id;
    const offset = req.query.offset;
    let act_url = process.env['GET_USER_PROFILE_URL'];
    act_url = act_url.replace("${user_id}", user_id);
    if (offset) {
        act_url = act_url.replace("${offset}", offset);
    } else {
        act_url = act_url.replace("${offset}", '0');
    }

    axios.get(act_url).then((response) => {
        const recommendation_items = [];
        for (dt of response.data.data) {
            const res_data = {}
            res_data.item_id = dt?.id;
            res_data.status = dt?.status?.status;
            res_data.added = dt?.created_at_first;


            res_data.title = dt?.title;
            res_data.description = dt?.description;

            res_data.price = {
                currency: dt?.price?.value?.currency?.iso_4217,
                value: dt?.price?.value?.raw
            };

            const images = [];
            for (img of dt.images) {
                images.push(img.full.url);
            }
            res_data.images = images;
            res_data.videos = dt.videos;

            res_data.parameters = dt?.parameters;

            res_data.locations = {
                name: dt?.locations_resolved?.COUNTRY_name + "," + dt?.locations_resolved?.ADMIN_LEVEL_1_name + "," + dt?.locations_resolved?.SUBLOCALITY_LEVEL_1_name,
                lat: dt?.locations[0].lat,
                lon: dt?.locations[0].lon

            };

            res_data.user_id = dt?.user_id;
            res_data.category_id = dt?.category_id;
            res_data.ad_id = dt?.ad_id;


            recommendation_items.push(res_data);
        }
        res.send(recommendation_items);
        // res.send(response.data);
        res.end();
    }).catch((err) => {
        console.error(err);
        res.end();
    });
});

// categories
app.get('/categories', async (req, res) => {
    let act_url = process.env['GET_CATEGORIES_URL'];
    axios.get(act_url).then((response) => {
        const categories = [];
        for (dt of response.data.data) {
            const res_data = {}
            res_data.category_id = dt?.id;
            res_data.key = dt?.key;
            res_data.name = dt?.name;
            res_data.display_order = dt?.display_order;

            const subcategories = [];
            for (subcat of dt.sub_categories) {
                const res_data_data = {}
                res_data_data.category_id = subcat?.id;
                res_data_data.key = subcat?.key;
                res_data_data.name = subcat?.name;
                res_data_data.display_order = subcat?.display_order;

                subcategories.push(res_data_data);
            }
            res_data.sub_categories = subcategories
            categories.push(res_data);
        }
        res.send(categories);
        // res.send(response.data);
        res.end();
    }).catch((err) => {
        console.error(err);
        res.end();
    });
});

// locations
app.get('/locations', async (req, res) => {
    let act_url = process.env['GET_LOCATIONS_URL'];
    axios.get(act_url).then((response) => {
        const locations = [];
        for (dt of response.data.data[0].children) {
            const res_data = {}
            res_data.location_id = dt?.id;
            res_data.name = dt?.name;
            res_data.type = dt?.type;
            res_data.lat = dt?.latitude;
            res_data.lon = dt?.longitude;

            const sublocations = [];
            for (subloc of dt.children) {
                const res_data_data = {}
                res_data_data.location_id = subloc?.id;
                res_data_data.name = subloc?.name;
                res_data_data.type = subloc?.type;
                res_data_data.lat = subloc?.latitude;
                res_data_data.lon = subloc?.longitude;

                sublocations.push(res_data_data);
            }
            res_data.sub_locations = sublocations
            locations.push(res_data);
        }
        res.send(locations);
        // res.send(response.data);
        res.end();
    }).catch((err) => {
        console.error(err);
        res.end();
    });
});

// custom based on location 
app.get('/custom', async (req, res) => {
    const lat = req.query.lat;
    const lon = req.query.lon;
    const category_id = req.query.category_id;

    let act_url = process.env['GET_CUSTOM_URL'];

    // location
    if (lat && lon) {
        act_url = act_url.replace("${lat}", lat);
        act_url = act_url.replace("${lon}", lon);

    } else {
        // lat=21.63726,
        // lon=78.96367
        act_url = act_url.replace("${lat}", 21.63726);
        act_url = act_url.replace("${lon}", 78.96367);
    }

    // category 
    if (category_id) {
        act_url = act_url.replace("${category_id}", category_id);

    } else {
        // category_id=84
        act_url = act_url.replace("${category_id}", 84);
    }

    axios.get(act_url).then((response) => {
        const pages = [];
        for (dt of response.data.data) {
            const res_data = {}
            res_data.item_id = dt?.id;
            res_data.status = dt?.status?.status;
            res_data.added = dt?.created_at_first;


            res_data.title = dt?.title;
            res_data.description = dt?.description;

            res_data.price = {
                currency: dt?.price?.value?.currency?.iso_4217,
                value: dt?.price?.value?.raw
            };

            const images = [];
            for (img of dt.images) {
                images.push(img.full.url);
            }
            res_data.images = images;
            res_data.videos = dt.videos;

            res_data.parameters = dt?.parameters;

            res_data.locations = {
                name: dt?.locations_resolved?.COUNTRY_name + "," + dt?.locations_resolved?.ADMIN_LEVEL_1_name + "," + dt?.locations_resolved?.SUBLOCALITY_LEVEL_1_name,
                lat: dt?.locations[0].lat,
                lon: dt?.locations[0].lon

            };

            res_data.user_id = dt?.user_id;
            res_data.category_id = dt?.category_id;
            res_data.ad_id = dt?.ad_id;


            pages.push(res_data);
        }
        res.send(pages);
        // res.send(response.data);
        res.end();
    }).catch((err) => {
        console.error(err);
        res.end();
    });
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
