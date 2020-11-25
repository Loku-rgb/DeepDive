const express = require ('express');
const router = express.Router();
const crypto = require('crypto');
const {User} = require('../models/modelSchemas');
const {Tag} = require('../models/modelSchemas');
const {Invoices} = require('../models/modelSchemas');
const {Contacts} = require('../models/modelSchemas');
const {Package} = require('../models/modelSchemas');
const {Message} = require('../models/modelSchemas');
const {ContactMetadata} = require('../models/modelSchemas');

var ObjectId = require('mongoose').Types.ObjectId; 
//------------------------------------------------------stripe----------------------------------------------------------------------------------------
const stripe = require('stripe')('sk_test_51GzbZ4IYRzF4KXae1fmIZBx18oclPNO5qUEsc5ar8zWhDv4TQuzSF8YOOOIFwjsufRQMaJbOUXX3LR9Zasu47wQM00IAH3Rbpf');

router.post('/create-customer', async (req, res) => {
  const customer = await stripe.customers.create(req.body);
  res.send(customer.id);
});

router.post('/create-subscription', async (req, res) => {
  console.log("called /create-subscription : ",req.body)
  // Set the default payment method on the customer
  try {
    await stripe.paymentMethods.attach(req.body.paymentMethodId, {
      customer: req.body.customerId,
    });
  } catch (error) {
    return res.status('402').send({ error: { message: error.message } });
  }

  let updateCustomerDefaultPaymentMethod = await stripe.customers.update(
    req.body.customerId,
    {
      invoice_settings: {
        default_payment_method: req.body.paymentMethodId,
      },
    }
  );

  // Create the subscription
  const subscription = await stripe.subscriptions.create({
    customer: req.body.customerId,
    items: [{ price: req.body.priceId==="BASIC"?"price_1HRMGyIYRzF4KXaeJTePz6bK":"price_1HRMJfIYRzF4KXaeHnsBShAo" }],
    expand: ['latest_invoice.payment_intent'],
  });
  console.log("/create-subscription ,sending subscription : ",subscription)
  res.send(subscription);
});

router.get('/retrieve-customer/:customerId', async (req,res) =>{

  const customer = await stripe.customers.retrieve(
    (req.params.customerId)
  );
  res.send(customer)
})

router.post('/retry-invoice', async (req, res) => {
  // Set the default payment method on the customer

  try {
    await stripe.paymentMethods.attach(req.body.paymentMethodId, {
      customer: req.body.customerId,
    });
    await stripe.customers.update(req.body.customerId, {
      invoice_settings: {
        default_payment_method: req.body.paymentMethodId,
      },
    });
  } catch (error) {
    // in case card_decline error
    return res
      .status('402')
      .send({ result: { error: { message: error.message } } });
  }

  const invoice = await stripe.invoices.retrieve(req.body.invoiceId, {
    expand: ['payment_intent'],
  });
  console.log("/retry-invoice ,sending invoice : ",invoice)

  res.send(invoice);
});

router.get('/retrieve-customer-subscription/:subscriptionId', async (req,res) =>{
  const subscription = await stripe.subscriptions.retrieve(
    req.params.subscriptionId
  );
  res.send(subscription)
})

router.post('/retrieve-upcoming-invoice', async (req, res) => {
  const subscription = await stripe.subscriptions.retrieve(
    req.body.subscriptionId
  );

  const invoice = await stripe.invoices.retrieveUpcoming({
    subscription_prorate: true,
    customer: req.body.customerId,
    subscription: req.body.subscriptionId,
    subscription_items: [
      {
        id: subscription.items.data[0].id,
        deleted: true,
      },
      {
        price: process.env[req.body.newPriceId],
        deleted: false,
      },
    ],
  });
  res.send(invoice);
});

router.post('/cancel-subscription', async (req, res) => {
  // Delete the subscription
  const deletedSubscription = await stripe.subscriptions.del(
    req.body.subscriptionId
  );
  res.send(deletedSubscription);
});

router.post('/update-subscription', async (req, res) => {
  const subscription = await stripe.subscriptions.retrieve(
    req.body.subscriptionId
  );
  const updatedSubscription = await stripe.subscriptions.update(
    req.body.subscriptionId,
    {
      cancel_at_period_end: false,
      items: [
        {
          id: subscription.items.data[0].id,
          price: process.env[req.body.newPriceId],
        },
      ],
    }
  );

  res.send(updatedSubscription);
});

router.post('/retrieve-customer-payment-method', async (req, res) => {
  const paymentMethod = await stripe.paymentMethods.retrieve(
    req.body.paymentMethodId
  );

  res.send(paymentMethod);
});

//------------------------------------------------------stripe------end------------------------------------------------------------

// get a list of users from the db // 5f27c1a39a9acd12811864bc
router.get('/userDetails/:userId', function(req, res, next){
    User.find({"_id" : new ObjectId(req.params.userId)},function(err, doc) {
       res.send(err?err:doc[0])
  })
});

// put a stripeCustomerId the db // 5f27c1a39a9acd12811864bc
router.put('/userDetails/:userId', function (req, res, next) {
  // console.log(req.body)
  User.findByIdAndUpdate(
    { _id: new ObjectId(req.params.userId) },req.body,
    function (err, result) {
      if (err) {
        console.log("Error in Saving : ", err);
        res.send(`Error : ${err}`);
      } else {
        //console.log("Saved");
        res.send("Saved");
      }
    }
  )
})

// get a "list of invoices" for person with userId in JSON req body as....eg : {  "userId" : "5f27d43b9a9acd12811864e4"  }
router.get('/invoicesList', function (req, res, next) {
  Invoices.find({"userId":req.query.userId}, function (err, doc) {
    res.send(err ? err : doc)
  })
});

// save invoice billing Address in Invoice Page. req.body(_id(the invoice Id),address,state,city,postcode)
router.put("/SaveInvoicesBillingSettings", function (req, res, next) {
  //console.log("req.body : ",typeof(req.body.postCode.toString()))
  Invoices.findByIdAndUpdate(
    { _id: req.body._id },
    {
      address: req.body.address,
      state: req.body.state,
      city: req.body.city,
      postCode: req.body.postCode,
    },
    function (err, result) {
      if (err) {
        console.log("Error in Saving Billing Settings: ", err);
        res.send(`Error : ${err}`);
      } else {
        //console.log("Saved");
        res.send("Saved");
      }
    }
  );
  // Invoices.find({ userId: req.body.userId }, function (err, doc) {
  //   if(err) res.send("Error saving billing settings : ",err)
  //   else {
  //     res.send(doc);
  //   }
  // });
});

// get a "list of tags" for person with userId in JSON req body as....eg : {"userId" = "5f27c1a39a9acd12811864bc"}
router.get('/tagsList/:tagId', function(req, res, next){
    Tag.find({"_id": new ObjectId(req.params.tagId)},'tag_name color_code userId ',function(err, doc) {
       res.send(err?err:doc)
  })
});

// get a "list of contacts" for person with userId in JSON req body as....eg : {"userId" = "5f27c1a39a9acd12811864bc"}
router.get('/contactsList/:userId', function (req, res, next) {

  Contacts.find(
    { "user": new ObjectId(req.params.userId) },
    'first_name last_name email organization occupation tone tags phone total_messages created_on ',
    function (err, contactsArray) {
      res.send(err ? err : contactsArray)
    })
});

//get Insights with particular contact, req.body = {userId="...",contactId="..."}
router.get('/contactInsights', function (req, res, next) {

  ContactMetadata.find(
    {"user": new ObjectId(req.body.userId), "contact": new ObjectId(req.body.contactId)},
    'tone_over_week tone_over_month mail_per_week mail_per_month',
    function (err, contactMetadataArray) {
      res.send(err?err:contactMetadataArray[0]);
    })

});

router.get('/signIn', function (req, res, next) {

//   function getAlgorithm(keyBase64) {

//     var key = Buffer.from(keyBase64, 'base64');
//     switch (key.length) {
//         case 16:
//             return 'aes-128-cbc';
//         default :
//             return 'aes-256-cbc';

//     }

//     throw new Error('Invalid key length: ' + key.length);
// }



//   function encrypt(plainText, keyBase64, ivBase64) {

//     const key = Buffer.from(keyBase64, 'base64');
//     const iv = Buffer.from(ivBase64, 'base64');

//     const cipher = crypto.createCipheriv(getAlgorithm(keyBase64), key, iv);
//     let encrypted = cipher.update(plainText, 'utf8', 'base64')
//     encrypted += cipher.final('base64');
//     return encrypted;
// };

// function decrypt (messagebase64, keyBase64, ivBase64) {

//     const key = Buffer.from(keyBase64, 'base64');
//     const iv = Buffer.from(ivBase64, 'base64');

//     const decipher = crypto.createDecipheriv(getAlgorithm(keyBase64), key, iv);
//     let decrypted = decipher.update(messagebase64, 'base64');
//     decrypted += decipher.final();
//     return decrypted;
// }


var SALT = "6573ffa8b04f46ecae79769d86f581cf";
var ivBase64 = 'anySaltYouCanUseOfOn';
// var plainText = 'blue@1234';
// var keyBase64 = crypto.pbkdf2Sync(ivBase64, Buffer.from(SALT, 'utf16le'), 65536, 256, 'sha1').toString('hex');
// res.send(typeof(Buffer.from(SALT, 'utf16le')))
// var cipherText = encrypt(plainText, keyBase64, ivBase64);
// var decryptedCipherText = decrypt(cipherText, keyBase64, ivBase64);

// console.log('Algorithm: ' + getAlgorithm(keyBase64));
// console.log('Plaintext: ' + plainText);
// console.log('Ciphertext: ' + cipherText);
// console.log('Decoded Ciphertext: ' + decryptedCipherText);

// res.send({

//   'Algorithm ' : getAlgorithm(keyBase64),
// 'Plaintext ' : plainText,
// 'Ciphertext ' : cipherText,
// 'Decoded Ciphertext ' : decryptedCipherText

// })

  // let SECRET_KEY = '6573ffa8b04f46ecae79769d86f581cf'
  // let SALT = 'anySaltYouCanUseOfOn'

  // let hash = crypto.pbkdf2Sync(SECRET_KEY, Buffer.from(SALT, 'hex'), 65536, 256, 'sha1').toString('hex');

  // const key = Buffer.from(keyBase64, "base64");
  // const iv = Buffer.from(ivBase64, "base64");

  // function getAlgorithm(keyBase64) {
  //   var key = Buffer.from(keyBase64, "base64");
  //   switch (key.length) {
  //     case 16:
  //       return "aes-128-cbc";
  //     case 32:
  //       return "aes-256-cbc";
  //   }

  //   throw new Error("Invalid key length: " + key.length);
  // }

  // const cipher = crypto.createCipheriv(getAlgorithm(keyBase64), key, iv);
  // let encrypted = cipher.update(plainText, "utf8", "base64");
  // encrypted += cipher.final("base64");
  // return encrypted;

  // // our data to encrypt
  // let data = 'blue@123';
  // console.log('data=', data);

  // // generate initialization vector
  // let iv = new Buffer.alloc(16); // fill with zeros
  // console.log('iv=', iv);

  // // encrypt data
  // let cipher = crypto.createCipheriv('aes-256-cbc', hash, iv);
  // let encryptedData = cipher.update(hash, 'utf8', 'hex') + cipher.final('hex');
  // res.send('encrypted data=', encryptedData.toUpperCase());

  // crypto.pbkdf2('secret', 'salt', 100000, 512, 'sha512', (err, key) => {
  //   if (err) throw err;
  //   console.log(key.toString('hex'));  // 'c5e478d...1469e50'
  // });

  // var mystr = crypto.createCipher('aes-128-cbc', 'mypassword').update('abc', 'utf8', hash)
  // mystr += mykey.final('hex');

  // console.log(mystr); //34feb914c099df25794bf9ccb85bea72

});

//get Billings Plans from "packages in db"
router.get('/package', function (req, res, next) {
  Package.find({_id:new ObjectId(req.query._id)}, function (err, doc) {
    if(err){ console.log(err); res.send("Error")}
    else res.send(doc[0])
  })
});

//get messageList from "message in db"
router.get('/messageList', function (req, res, next) {

  Message.find({ "user": new ObjectId(req.body.userId) },'contact tags',function (err, docs) {
    res.send(err ? err : docs)
    // if (!err) {
    //   docs.map((doc)=>{
    //     Contacts.find({ "user": new ObjectId(req.body.userId) }, 'first_name', function (err, doc) {
    //       res.send(err ? err : doc)
    //     })
    //   })
    // }
    // else res.send(err)
  })
});

// get a "list of tags" for person with userId in JSON req body as....eg : {"userId" = "5f27c1a39a9acd12811864bc"}
router.get('/contactDocuments/:userId/:contactId', function(req, res, next){
  Message.find({"user": new ObjectId(req.params.userId), "contact": new ObjectId(req.params.contactId)},'email_details',function(err, doc) {
    let formattedDoc = [];

    if(!err) {
      formattedDoc = doc.map((message,index)=>{
        console.log("message.email_details : ", message.email_details)
          return ({
            attachments : message.email_details,
            received_date : message.email_details,
            tags : []
          })
      })
      res.send(formattedDoc)
    }
    res.send(err)
})
});


module.exports = router;
