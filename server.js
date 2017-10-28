// Grabs our environment variables from the .env file
require('dotenv').config();
var express = require('express'),
bodyParser = require('body-parser'),
methodOverride = require('method-override'),
cors = require('cors'),
app = express();


var env = process.env.NODE_ENV = process.env.NODE_ENV || 'development';
var port = process.env.PORT || 3000;

var router = express.Router();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(methodOverride());

var stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

router.post('/charge', function(req, res){

    var newCharge = {
        amount: 23500,
        currency: 'usd',
    source: req.body.token_from_stripe,
        description: req.body.specialNote,
        receipt_email: req.body.email,
        shipping: {
        name: req.body.name,
            address: {
            line1: req.body.address.street,
                city: req.body.address.city,
                state: req.body.address.state,
                postal_code: req.body.address.zip,
                country: 'US'
        }
    }
};
    // Call the stripe objects helper functions to trigger a new charge
    stripe.charges.create(newCharge, function(err, charge) {
        // send response
        if (err){
            console.error(err);
            res.json({ error: err, charge: false });
        } else {
            // send response with charge data
            res.json({ error: false, charge: charge });
        }
    });
});
// Route to get the data for a charge filtered by the charge's id
router.get('/charge/:id', function(req, res){
    stripe.charges.retrieve(req.params.id, function(err, charge) {
        if (err){
            res.json({ error: err, charge: false });
        } else {
            res.json({ error: false, charge: charge });
        }
    });
});
// Register the router
app.use('/', router);
// Start the server
app.listen(port, function(){
    console.log('Server listening on port ' + port)
});